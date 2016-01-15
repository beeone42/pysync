#!/usr/bin/env python

import os, json, sys, glob, hashlib, time, datetime, json, requests, urllib2, random

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


def merge_dicts(*dict_args):
        '''
        Given any number of dicts, shallow copy and merge into a new dict,
        precedence goes to key value pairs in latter dicts.
        '''
        result = {}
        for dictionary in dict_args:
                result.update(dictionary)
        return result

"""
Scan a directory and get all file's name / size and mtime
If not mask is not mentionned, * is default
"""

def scan_directory(path, mask):
	if mask == "":
		mask = "*"
	print "Scanning [%s] on [%s]." % (mask, path)
	try:
		os.chdir(path)
		# print "dir changed"
		list_of_file = {}
		for f in glob.glob(mask):
			# print "f:[%s]" % (f)
			if os.path.isdir(f) == False:
				statinfo = os.stat(f)
				list_of_file[f] = {"path": f, "size": str(statinfo.st_size), "mtime": str(time.strftime("%Y-%m-%dT%H:%M:%SZ", (time.gmtime(statinfo.st_mtime))))}
                        else:
                                tmp = scan_directory(path, f + "/*")
                                list_of_file.update(tmp);
                                        
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
		obj_json["size"] = dic[item]["size"]
		obj_json["mtime"] = dic[item]["mtime"]
		obj_json["md5"] = str(md5(path))
		list_array.append(obj_json)
	return json.dumps(list_array)


"""
log function
"""

def ilog(log_msg):
	print str(datetime.datetime.now()) + " - " + log_msg.strip()


"""
GET request to register client
"""

def register_client(conf, folder):
	data = {}
	data['s_key'] = conf['folders'][folder]['s_key']
	data['m_key'] = conf['folders'][folder]['m_key']
	data['auth'] = conf['server_password']
	data['baseurl'] = conf['folders'][folder]['baseurl']
	url = conf['server_url'] + "/api/" + conf['api_version'] + '/register_client'
	res = requests.get(url, params=data)
	if str(json.loads(res.text)['succes']) != "True":
		print "register client failed for folder [%s]." % folder
	return (json.loads(res.text)['data']['client_id'])

"""
POST request to put list,  TODO avant faire un reset si diff ok ou pas
"""

def put_list(conf, folder, files):
        print "put_list "
        print files
	data = {}
	data['s_key'] = conf['folders'][folder]['s_key']
	data['auth'] = conf['server_password']
	data['client_id'] = conf['folders'][folder]['client_id']
	data['data'] = generate_json(files)
	url = conf['server_url'] + "/api/" + conf['api_version'] + '/put_list'
	res = requests.post(url, data=data)
	result = json.loads(res.text)
	print result
	if str(result['succes']) != "True":
		print "put list failed for folder [%s]." % folder
	print res.url
	print res.text

"""
GET reset a file list_array
"""

def reset_list(conf, folder):
	data = {}
	data['s_key'] = conf['folders'][folder]['s_key']
	data['auth'] = conf['server_password']
	data['client_id'] = conf['folders'][folder]['client_id']
	url = conf['server_url'] + "/api/" + conf['api_version'] + '/reset_list'
	res = requests.get(url, params=data)
	if str(json.loads(res.text)['succes']) != "True":
		print "reset list failed for folder [%s]." % folder


"""
GET get_list, get the file list of a slave s_key
"""

def get_list(conf, folder):
	print(folder)
	data = {}
	data['s_key'] = folder['s_key']
	data['auth'] = conf['server_password']
	url = conf['server_url'] + "/api/" + conf['api_version'] + '/get_list'
	res = requests.get(url, params=data)
	j = json.loads(res.text)
	if str(j['succes']) != "True":
		print "get list failed for folder [%s]." % folder
	return j['data']


"""
GET dl_file
"""
def get_file(conf, folder, path):
		data = {}
		data['s_key'] = folder['s_key']
		data['auth'] = conf['server_password']
		data['path'] = path
		# print(data)
		url = conf['server_url'] + "/api/" + conf['api_version'] + '/get_file'
		res = requests.get(url, params=data)
		j = json.loads(res.text)
		# print j
		if str(j['succes']) != "True":
				print "get file failed for [%s]/[%s]." % (folder['path'], path)
                random.shuffle(j['data'])
		return j['data']

"""
diff between the server and slave list and master list
"""

def diff_list(master, local):
		res = []
		for mf in master:
				#print mf['path']
				if (local.has_key(mf['path']) == False):
						print "%s not in local list." % (mf['path'])
						res.append(mf)
				else:
						if (int(local[mf['path']]['size']) != int(mf['size'])):
								print "%s not the same size (m: %s l: %s)." % (mf['path'], mf['size'], local[mf['path']]['size'])
								res.append(mf)
		return (res)


def dl_file(url, file_name):
        # Download the file from `url` and save it locally under `file_name`:
        print "dl_file: " + url + " to " + file_name
        try:
                response = urllib2.urlopen(url, None, 2)
                out_file = open(file_name, 'wb')
                while True:
                        data = response.read(4096)
                        if data:
                                out_file.write(data)
                        else:
                                break
                out_file.close()
        except Exception, e:
                print "Erreur : %s" % e
                return False
        return True

def dl_list(conf, folder, files):
	for f in files:
		print f
                d = os.path.dirname(conf['folders'][folder]['path'] + f['path'])
                if (os.path.isdir(d) is not True):
                        os.makedirs(d)
		us = get_file(conf, conf['folders'][folder], f['path'])
                for u in us:
		        print "--> %s%s" % (u['baseurl'], u['path'])
                        if (dl_file(u['baseurl'] + u['path'], conf['folders'][folder]['path'] + u['path'])):
                                md5sum = md5(conf['folders'][folder]['path'] + u['path'])
                                if (md5sum == f['md5']):
                                        print "md5 ok !"
                                        put_list(conf, folder, {u['path']:u})
                                        break
                                else:
                                        os.unlink(conf['folders'][folder]['path'] + u['path'])


        """
START POINT
"""

if __name__ == "__main__":
	with open(CONFIG_FILE, 'r') as f:
		content = f.read()
		#client_id = register_client(content)
		#put_list(content)
		# sys.exit 
				
		conf = json.loads(content)
		for folder in conf['folders']:
                        local_list = scan_directory(conf['folders'][folder]['path'], "")
                        if (conf['folders'][folder].has_key('client_id')== False):
                                conf['folders'][folder]['client_id'] = register_client(conf, folder)
                        if (conf['folders'][folder]['m_key'] != ""): # master
                                reset_list(conf, folder)
                                put_list(conf, folder, local_list)
                        else:
			        master_list = get_list(conf, conf['folders'][folder])
			        delta = diff_list(master_list, local_list)
                                dl_list(conf, folder, delta)
