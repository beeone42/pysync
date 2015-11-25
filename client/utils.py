#!/usr/bin/env python

import os, json, sys, glob, hashlib

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
Scan a repertory and check all the file in it
If not file_ext is mentionned, * is default
"""

def scan_repertory(path, file_ext):
	if file_ext == "":
		file_ext == "*"
	try:
		os.chdir(path)
		for file in glob.glob(file_ext):
			print(file)
	except:
		print "Path [%s] doesn't exist, aborting." % (path)
		sys.exit(1)

"""
Md5 checksum a file
"""

def md5(file_name):
    hash = hashlib.md5()
    with open(file_name, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash.update(chunk)
    return hash.hexdigest()
