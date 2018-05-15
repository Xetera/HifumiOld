import os
import subprocess
import boto3
from typing import Tuple

path = os.path.dirname(os.path.abspath(__file__))
BUCKET_NAME = 'hifumibackup'


def log(message):
    print(f'[DB:RESTORE]: {message}')


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


def get_backup(target_bucket) -> str or None:
    backups = [file['Key'] for file in sorted(target_bucket, key=lambda file: file['Key'])]
    if not backups:
        return log('No backups were found in bucket.')
    return backups.pop()


if __name__ == '__main__':
    database_url, aws_key, aws_secret = fetch_credentials()

    client = boto3.client(
        's3',
        aws_access_key_id=aws_key,
        aws_secret_access_key=aws_secret
    )

    bucket = None
    try:
        bucket = client.list_objects(Bucket=BUCKET_NAME)['Contents']
    except KeyError:
        log('Could not restore a backup, bucket is completely empty.')
        quit(1)

    file_name = get_backup(bucket)
    output_name = file_name.split('-').pop()
    output_target = f'db-restore-{output_name}'

    client.download_file(BUCKET_NAME, file_name, os.path.join('pg_restore', output_target))

    output_path = os.path.join(path,"pg_restore", output_target)
    """
    Flags:
    -Ft=> Filetype .tar
    -c => clean database
    -v => verbose
    -d => database name
    """
    # Database restore doesn't work if the database 'discord' is missing
    try:
        subprocess.check_call(
            f'pg_restore -Ft -c -d discord --no-owner {output_path}',
            shell=True
        )
    except Exception as e:
        log(e)
        quit(1)

    os.remove(output_path)
    log('Removed local dump.')

    log('Restored database.')
