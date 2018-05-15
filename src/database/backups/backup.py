import os
import time
import subprocess
import boto3
from typing import Tuple, List

DATABASE_NAME = 'discord'
BUCKET_NAME = 'hifumibackup'
MAX_BACKUPS = 5

path = os.path.dirname(os.path.abspath(__file__))

dump_file = os.path.join(path, 'pg_dump')
file_name = '{}-backup-{}.tar'.format(DATABASE_NAME, time.time())
output_file = os.path.join(dump_file, file_name)


def log(message):
    print('[CRON:BACKUP]: {}'.format(message))


def fetch_credentials() -> Tuple[str, str, str] or None:
    try:
        return (
            os.environ['DATABASE_URL'],
            os.environ['AWS_ACCESS_KEY_ID'],
            os.environ['AWS_SECRET_ACCESS_KEY']
        )
    except KeyError as key:
        log('Missing mandatory environment variable {}, quitting backup.'.format(key))
        quit(1)


def cycle_old_files(boto_client, bucket_input: List, backup_amount=3) -> None:
    """
    Used to make sure there is only {backup_amount} of files in the s3 Bucket.
    Deletes all the other files to prevent taking up space
    """

    # The 'Key' or the name of the file is constant except for
    # the unix timestamp at the end which get sorted in descending order
    backups = sorted([file for file in bucket_input], key=lambda file: file['Key'])

    if len(backups) < backup_amount:
        return log('Less than {} backups found, not cycling.'.format(backup_amount))

    # Everything past the latest {backup_amount} of files is expired
    expired_backups = backups[:len(backups) - backup_amount]

    if not expired_backups:
        return log('{} files found in bucket, not cycling.'.format(backup_amount))

    try:
        delete_response = boto_client.delete_objects(
            Bucket=BUCKET_NAME,
            Delete={
                'Objects': [{'Key': file['Key']} for file in expired_backups]
            }
        )
    except Exception as error:
        log('Error while attempting to cycle {} backups from bucket.'.format(len(expired_backups)))
        return log(error)

    deleted_items = delete_response['Deleted']

    if not deleted_items:
        return log('Could not cycle any files from bucket.')

    log('Cycled {} backup(s) from bucket.'.format(len(deleted_items)))

    delete_list = '\n'.join(["[CRON:BACKUP]: -> {}".format(item['Key']) for item in deleted_items])
    print(delete_list)


if __name__ == '__main__':
    start_time = time.time()
    database_url, aws_key, aws_secret = fetch_credentials()

    client = boto3.client(
        's3',
        aws_access_key_id=aws_key,
        aws_secret_access_key=aws_secret
    )

    subprocess.check_call('pg_dump -Ft {} > {}'.format(database_url, output_file), shell=True)
    client.upload_file('pg_dump/{}'.format(file_name), 'hifumibackup', file_name)

    log('Backed up {} to s3 Bucket.'.format(file_name))
    log('Attempting to cycle old files.')

    try:
        bucket = client.list_objects(Bucket=BUCKET_NAME)['Contents']
        cycle_old_files(client, bucket, backup_amount=MAX_BACKUPS)
    except KeyError:
        log('Bucket "{}" is empty, not cycling.'.format(BUCKET_NAME))

    os.remove(output_file)
    log('Deleted local dump file.')

    end_time = time.time()
    log('Finished backups in {} seconds.'.format(end_time - start_time))
