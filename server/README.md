# pysync replication server
This script is the sync central server
Edit config.json to change server organization password

to run the pysync server:

git clone https://github.com/beeone42/pysync.git
cd server/
npm install
npm start

to test your file webserver you can simply use this kind of command (insecure! do not use in production)
python -m SimpleHTTPServer 8080
