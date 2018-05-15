import os
import time
import subprocess
import boto3

# TEST
# os.environ['DATABASE_URL'] = 'postgres://localhost/discord'
# os.environ['AWS_BUCKET_URL'] =

database_url = os.environ['DATABASE_URL']
aws_key = os.environ['AWS_BUCKET_URL']

boto3.client('s3',
             aws_access_key_id=aws_key)

subprocess.call(f'pg_dump {database_url} -f t > ', shell=True)
