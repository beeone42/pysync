#!/usr/bin/env python

import os, json, sys, glob, hashlib, time, datetime, json, requests, wget


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
	# print "Sanning [%s] on [%s]." % (mask, path)
	try:
		os.chdir(path)
		# print "dir changed"
		list_of_file = {}
		for f in glob.glob(mask):
			print "f:[%s]" % (f)
			if os.path.isdir(f) == False:
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
        print "MD5: %s" % (file_name)
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
		path = item
		obj_json["path"] = path
		obj_json["size"] = dic[item].split('@')[0]
		obj_json["mtime"] = dic[item].split('@')[1]
		obj_json["md5"] = str(md5(path))
		list_array.append(obj_json)
	return json.dumps(list_array)


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
GET request to register client
"""

def register_client(content):
	conf = json.loads(content)
	version = conf['api_version']
	result = {}
	for folder in conf['folders']:
		data = {}
		data['s_key'] = conf['folders'][folder]['s_key']
		data['m_key'] = conf['folders'][folder]['m_key']
		data['auth'] = conf['server_password']
		data['baseurl'] = conf['folders'][folder]['baseurl']
		url = conf['server_url'] + "/api/" + version + '/register_client'
		res = requests.get(url, params=data)
		if str(json.loads(res.text)['succes']) != "True":
			print "register client failed for folder [%s]." % folder
			break
		result[folder] = json.loads(res.text)['data']['client_id']
		print res.text
	print result
	return result

"""
POST request to put list,  TODO avant faire un reset si diff ok ou pas
"""

def put_list(content):

	#  VOIR TODO ABOVE

	reset_list(content)

	conf = json.loads(content)
	version = conf['api_version']
	da = register_client(content)
	for folder in conf['folders']:
		data = {}
		data['s_key'] = conf['folders'][folder]['s_key']
		data['auth'] = conf['server_password']
		data['client_id'] = da[folder]
		data['data'] = generate_json(scan_directory(conf['folders'][folder]['path'], ""))
		url = conf['server_url'] + "/api/" + version + '/put_list'
		res = requests.post(url, data=data)
		result = json.loads(res.text)
		print result
		if str(result['succes']) != "True":
			print "put list failed for folder [%s]." % folder
			break
		print res.url
		print res.text


"""
GET reset a file list_array
"""

def reset_list(content):
	conf = json.loads(content)
	version = conf['api_version']
	da = register_client(content)
	for folder in conf['folders']:
		data = {}
		data['s_key'] = conf['folders'][folder]['s_key']
		data['auth'] = conf['server_password']
		data['client_id'] = da[folder]
		url = conf['server_url'] + "/api/" + version + '/reset_list'
		res = requests.get(url, params=data)
		if str(json.loads(res.text)['succes']) != "True":
			print "reset list failed for folder [%s]." % folder
			break


"""
GET get_list, get the file list of a slave s_key
"""

def get_list(content):
	conf = json.loads(content)	
	version = conf['api_version']
	da = register_client(content)
	server_list = {}
	for folder in conf['folders']:
		# print folder
		data = {}
		data['s_key'] = conf['folders'][folder]['s_key']
		data['auth'] = conf['server_password']
		url = conf['server_url'] + "/api/" + version + '/get_list'
		res = requests.get(url, params=data)
		server_list[folder] = res.text
		if str(json.loads(res.text)['succes']) != "True":
			print "get list failed for folder [%s]." % folder
			break
	return server_list


"""
GET get_file
"""

def get_file(content):
	conf = json.loads(content)	
	version = conf['api_version']
	server_list = get_list(content)
	for folder in conf['folders']:
		list_of_file = scan_directory(conf['folders'][folder]['path'], "")
		for elem in list_of_file:
			# print "============ %s =============" % (elem)
			data = {}
			data['s_key'] = conf['folders'][folder]['s_key']
			data['auth'] = conf['server_password']
			data['path'] = elem
			# print data['path']
			url = conf['server_url'] + "/api/" + version + '/get_file'
			res = requests.get(url, params=data)
			url_file = json.loads(res.text)['data'][0]['path']
			print data['path'].split('/')[-1]

"""
START POINT
"""

if __name__ == "__main__":
	with open(CONFIG_FILE, 'r') as f:
		content = f.read()
		register_client(content)
		put_list(content)
		# get_list(content)
		# get_file(content)































