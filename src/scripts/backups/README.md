# Backups and restoration

The backup script is run by a cron job every 1-2 days to add a .tar file to Amazon s3 Bucket, the amount of backups are
cycled based on the amount of target backups to keep

The restore script by default fetches the backup, cleans the database
and overrides the 'discord' database on localhost
##### This requires a database called 'discord' to be present.
