#!/usr/bin/env python

"""
TODO

foreach (config.paths as p)

list_master = dl list from server(p.slave_key)
list_local = create local list
if config_master_key != "":
	upload(dff(list_master, list_local), p.master_key, p.slave_key)
else
	download(dff(list_local, list_master), p.slave_key)


import os, json, sys, glob, hashlib, time, datetime
"""


CONFIG_FILE = 'config.json.sample'

"""
Open and load a file at the json format
"""

def open_and_load_config():
	if os.path.exists(CONFIG_FILE):
		with open(CONFIG_FILE, 'r') as config_file:
			return json.loads(config_file.read())		
	else:
		print "File [%s] doesn't exist, aborting." % (CONFIG_FILE)
		sys.exit(1)

"""
Scan a directory and get all file's name / size and mtime
If not mask is not mentionned, * is default
"""

def scan_directory(path, mask):
	if mask == "":
		mask = "*"
	try:
		os.chdir(path)
		list_of_file = {}
		for f in glob.glob(mask):
			statinfo = os.stat(f)
			list_of_file[f] = str(statinfo.st_size) + "@" + str(statinfo.st_mtime)
		return list_of_file
	except Exception as e:
		print "Path [%s] doesn't exist, aborting." % (path)

"""
Md5 checksum a file
"""

def md5(file_name):
    hash = hashlib.md5()
    with open(file_name, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash.update(chunk)
    return hash.hexdigest()

"""
Make a diff between master and client list
"""

def diff_list(master_list, client_list):
	print master_list
	print "-------------"
	print client_list

"""
log function
"""

def ilog(log_msg):
	print str(datetime.datetime.now()) + " - " + log_msg.strip()
