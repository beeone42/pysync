# pysync replication client
This script is the sync console client for the master or the slaves

Edit config.json to change server url, client behaviour, sync folders, and master/slave secrets

You need requests python package to run the client

    apt-get install python-pip
    pip install requests
    python ./utils.py

your client need to serve the file you want to sync with a file webserver

to test your file webserver you can simply use this kind of command (insecure! do not use in production)

    python -m SimpleHTTPServer 8080
