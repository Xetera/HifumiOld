import os
import subprocess

# subprocess.check_call('dropdb -h localhost discord_test', shell=True)
subprocess.check_call('createdb -h localhost discord_test', shell=True)