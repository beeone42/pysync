#!/usr/bin/env python

import os, json, sys, glob, hashlib, time, datetime, json, urllib2, urllib

CONFIG_FILE = 'config.json'

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
			list_of_file[f] = str(statinfo.st_size) + "@" + str(time.strftime("%Y-%m-%dT%H:%M:%SZ", (time.gmtime(statinfo.st_mtime))))
		return list_of_file
	except Exception as e:
		print e
		print "Path [%s] doesn't exist or mask [%s] isn't valid, aborting." % (path, mask)

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
Make a json with the dic from scan_directory
"""

def generate_json(dic):
	list_array = []
	for item in dic:
		obj_json = {}
		path = os.getcwd() + "/" + item
		obj_json["path"] = path
		obj_json["size"] = dic[item].split('@')[0]
		obj_json["mtime"] = dic[item].split('@')[1]
		obj_json["md5"] = str(md5(path))
		list_array.append(obj_json)
	print json.dumps(list_array)


"""
log function
"""

def ilog(log_msg):
	print str(datetime.datetime.now()) + " - " + log_msg.strip()


"""
diff the server list and slave list and output what need to be uploaded
"""

def diff(list_m, list_s):
	pass

"""
request to register client
"""

def register_client():
	with open(CONFIG_FILE, 'r') as f:
		conf = json.loads(f.read())
		s_url = conf['server_url']
		version = conf['api_version']
		server_pass = conf['server_password']
		s_key = conf['folders']['CDN']['s_key']
		base_url = conf['folders']['CDN']['baseurl']
		data = {}
		data['s_key'] = s_key
		data['auth'] = server_pass
		data['baseurl'] = base_url
		url_values = urllib.urlencode(data)
		url = s_url + "/api/" + version + '/register_client?' + url_values
		print url
		# data = urllib2.urlopen(url)

"""
request to put list
"""

def put_list():
	pass

#generate_json(scan_directory("/Users/jacob/projects/python/pysync/client", ""))
register_client()































