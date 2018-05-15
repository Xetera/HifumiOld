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
file_name = f'{DATABASE_NAME}-backup-{time.time()}.tar'
output_file = os.path.join(dump_file, file_name)


def log(message):
    print(f'[CRON:BACKUP]: {message}')


def fetch_credentials() -> Tuple[str, str, str] or None:
    try:
        return (
            os.environ['DATABASE_URL'],
            os.environ['AWS_ACCESS_KEY_ID'],
            os.environ['AWS_SECRET_ACCESS_KEY']
        )
    except KeyError as key:
        log(f'Missing mandatory environment variable {key}, quitting backup.')
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
        return log(f'Less than {backup_amount} backups found, not cycling.')

    # Everything past the latest {backup_amount} of files is expired
    expired_backups = backups[:len(backups) - backup_amount]

    if not expired_backups:
        return log(f'{backup_amount} files found in bucket, not cycling.')

    try:
        delete_response = boto_client.delete_objects(
            Bucket=BUCKET_NAME,
            Delete={
                'Objects': [{'Key': file['Key']} for file in expired_backups]
            }
        )
    except Exception as error:
        log(f'Error while attempting to cycle {len(expired_backups)} backups from bucket.')
        return log(error)

    deleted_items = delete_response['Deleted']

    if not deleted_items:
        return log('Could not cycle any files from bucket.')

    log(f'Cycled {len(deleted_items)} backup(s) from bucket.')

    delete_list = '\n'.join([f"[CRON:BACKUP]: -> {item['Key']}" for item in deleted_items])
    print(delete_list)


if __name__ == '__main__':
    start_time = time.time()
    database_url, aws_key, aws_secret = fetch_credentials()

    client = boto3.client(
        's3',
        aws_access_key_id=aws_key,
        aws_secret_access_key=aws_secret
    )

    subprocess.check_call(f'pg_dump -Ft {database_url} > {output_file}', shell=True)
    client.upload_file(f'pg_dump/{file_name}', 'hifumibackup', file_name)

    log(f'Backed up {file_name} to s3 Bucket.')
    log('Attempting to cycle old files.')

    try:
        bucket = client.list_objects(Bucket=BUCKET_NAME)['Contents']
        cycle_old_files(client, bucket, backup_amount=MAX_BACKUPS)
    except KeyError:
        log(f'Bucket "{BUCKET_NAME}" is empty, not cycling.')

    os.remove(output_file)
    log('Deleted local dump file.')

    end_time = time.time()
    log(f'Finished backups in {(end_time - start_time)} seconds.')
