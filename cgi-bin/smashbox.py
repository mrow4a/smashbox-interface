#!/usr/bin/python

# Import modules for CGI handling 
import cgi, cgitb 
import subprocess
import os
import socket
import json
import sys
f_name = 'test_results.json'

def get_data_from_json(f_name):
	import io
	with io.open(f_name,'r') as file:
		data = json.load(file)	
	return data


def json_response(data):
	print "Content-type: application/json"
	print 
	print(json.JSONEncoder().encode(data))	

def write_to_json_file(data, file=None):
	import io
	global f_name
	if file is None:
		file = f_name
	with io.open(file, 'w', encoding='utf-8') as f:
		f.write(unicode(json.dumps(data, ensure_ascii=False, indent=4)))
		

def rm_file(file_name):
	if(os.path.exists(file_name)):
		os.remove(file_name)

def get_lock():
	process_name = 'running_test'		
    	global lock_socket   # Without this our lock gets garbage collected
    	lock_socket = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    	try:
        	lock_socket.bind('\0' + process_name)
        	return 1
    	except socket.error:
        	return 0


		
class Configuration:
    # you may use config object for string interpolation "..."%config
    def __getitem__(self,x):
        return getattr(self,x)

    def _dict(self,**args):
        return dict(self.__dict__.items() + args.items()) 

    def get(self,x,default):
        try:
            return getattr(self,x)
        except AttributeError:
            return default	
           	
          
def get_conf(hide_sensitive):
	config = Configuration()
	cf = "/var/www/smashbox/cgi-bin/smashbox/etc/smashbox.conf"
	execfile(cf,{},config.__dict__)
	print "Content-type:text/plain\r\n\r\n"
	#print ("hide_sensitive: %s" % str(hide_sensitive)) + "</br>"
	for d in dir(config):
		if not d.startswith("_") and d != "get" and d != "oc_webdav_endpoint" and d != "oc_server_datadirectory":
			print "<label for="+str(d)+">"+str(d)+": </label>"
			if(hide_sensitive == "True" and (d == "oc_account_password" or d == "oc_admin_password" or d == "oc_server_shell_cmd")):
				type = 'password'
			else:
				type = 'text'
			#print "<b>" + str(d) + "</b> = " +str(getattr(config,d))+"</br>"
			if (d=='oc_server_folder' or d=='smashdir' or d=='oc_sync_cmd' or d=='oc_server_tools_path' or d=='web_user' or d=='rundir_reset_procedure'):
				print '<input type="url" name="oc_config" id="'+str(d)+'" size="35" value="'+str(getattr(config,d))+'" style="font-size: 10px;" />'
			elif (d=='oc_ssl_enabled' or d=='workdir_runid_enabled' or d=='oc_account_runid_enabled'):
				if(str(getattr(config,d))=="True"):
					checked = "checked"
				else:
					checked = ""	
				print '<input type="checkbox" name="oc_config" id="'+str(d)+'" value="'+str(getattr(config,d))+'" onchange=check_checkbox(this.id) '+checked+'/>'
			else:
				print '<input type="'+type+'" name="oc_config" id="'+str(d)+'" size="35" value="'+str(getattr(config,d))+'" style="font-size: 10px;" onfocus=conf_form_focus(this.id,"'+str(getattr(config,d))+'") onblur=conf_form_blur(this.id,"' +str(getattr(config,d))+'") />'
				  
			print '</br>'

def get_conf_status():
	print "Content-type:text/plain\r\n\r\n"
	rm_file('test.log')
	cmd = "/var/www/smashbox/cgi-bin/smashbox/bin/smash --check-connection /var/www/smashbox/cgi-bin/smashbox/lib/test_basicSync.py >> test.log 2>&1"
	process = subprocess.Popen(cmd, shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
	process.communicate()
	array = []
	with open("test.log", "r") as ins:
		for line in ins:
			print str(line) + "</br>"
	rm_file('test.log')

def response(response_text):
	print "Content-type:text/plain\r\n\r\n"
	print response_text


def update_json_info(data, info):
	if (data.has_key("info")):
		data["info"]= info
	else:
		dict = { "info" : info }
		data.update(dict)
	return data	


def get_history():
	from os import listdir
	from os.path import isfile, join
	try:
		test_path = '/var/www/smashbox/cgi-bin'
		onlyfiles = [ f for f in listdir(test_path) if isfile(join(test_path,f)) ]
		test_array = []
		for i in range(0, len(onlyfiles)):
			test = onlyfiles[i]
			test_correct = test.split("test_results-", 1)
			if(len(test_correct) > 1):
				test_correct = test_correct[1].split(".json")
				test_runid = test_correct[0]
				data = get_data_from_json(test)
				data["info"].insert(0,test_runid)
				test_array.append(data)
 		json_response(test_array)
	except Exception, e:
		response("error: %s" % e)	


def get_tests_list():
	from os import listdir
	from os.path import isfile, join
	import imp
	test_path = '/var/www/smashbox/cgi-bin/smashbox/lib'
	onlyfiles = [ f for f in listdir(test_path) if isfile(join(test_path,f)) ]
	test_array = []
	for i in range(0, len(onlyfiles)):
		test = onlyfiles[i]
		test_name = test.split(".py")
		if(len(test_name) > 1):
			test_name = test_name[0].split("test_")
			test_name = test_name[1]
			path = "/var/www/smashbox/cgi-bin/smashbox/lib/" + test
			sys.path.insert(0,'/var/www/smashbox/cgi-bin/smashbox/python')
			import smashbox.no_engine
			execfile(path,smashbox.no_engine.__dict__)
			testsets = smashbox.no_engine.testsets
			__doc__ = smashbox.no_engine.__doc__
			test_array.append({ test_name : { 'scenario' : testsets, 'info': __doc__ }})
 	json_response(test_array)

def stop_test():
	global f_name
	data = get_data_from_json(f_name)
	if(data.has_key("info") and data["info"]!="stop" and data["info"]!="test finished"):
		pid = data["info"]
	data = update_json_info(data, "stop")
	write_to_json_file(data)
	stop_test_function(pid)

def stop_test_function(pid):	
	import time
	import signal
	import io
	# killing all processes in the group
	pid = int(pid)
	try:
		os.killpg(pid, signal.SIGTERM)
		time.sleep(2)
		try:
			os.killpg(pid, signal.SIGKILL)
		except:
			pass
		time.sleep(2)
		response("ok")
	except Exception, e:
		response(e)

def finish_test(tests_array = None):
	import datetime
	import os
	global f_name
	if(os.path.exists(f_name)):
		data = get_data_from_json(f_name)	
		if(tests_array == None):
			tests_array = get_data_from_json('test_array.json')	
		if (json.dumps(data)).find("error") != -1:
			tests_array.insert(0,"Failed")
		else:
			tests_array.insert(0,"Passed")
		data = update_json_info(data, tests_array)
		write_to_json_file(data,'test_results-'+datetime.datetime.now().strftime("%y%m%d-%H%M%S")+'.json')
		rm_file(f_name)

def get_test_details(test_name):
	f_name = "test_results-" + test_name + ".json"
	if(os.path.exists(f_name)):
		data = get_data_from_json(f_name)
		json_response(data)
	else:
		response("error")
		
def get_progress():
	global f_name
	if(os.path.exists(f_name)):
		try:
			data = get_data_from_json(f_name)
			if(data.has_key("info") and data["info"]!="stop" and data["info"]!="test finished"):
				if(get_lock()==1):
					data = update_json_info(data, "test finished")
					finish_test()
				json_response(data)
			else:
				response("omitting-get-progress")
		except IOError:
			response("omitting-get-progress")
	else:
		response("omitting-get-progress")

def run(tests_array):
	import time
	import io
	global f_name
	try:
		decoded_data = tests_array[0]
		commands = []
		for key in decoded_data.keys():
			value = decoded_data[key]
			for pair in value:
				test_cmd = "/var/www/smashbox/cgi-bin/smashbox/bin/smash --keep-going --testset "+pair[0]+" --loop "+pair[1]+" /var/www/smashbox/cgi-bin/smashbox/lib/test_" + key + ".py"
				commands.append(test_cmd)
		
		for cmd in commands:
			process = subprocess.Popen(cmd, shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE, preexec_fn=os.setsid)
			pid = os.getpgid(process.pid)
			while (not os.path.exists(f_name)):
				time.sleep(1)
			try:
				
				data = get_data_from_json(f_name)
				if(data.has_key("info") and data["info"]=="stop"):
					stop_test_function(pid)
				else:
					data = update_json_info(data, pid)
					write_to_json_file(data)
					process.wait()
			except IOError:
				process.wait()	
		
	except Exception, e:
		response("error: %s" % e)

def delete_conf():
	rm_file('smashbox/etc/smashbox.conf')	
	response("ok")	
		
def set_conf(config_array):
	import re
	import io
	import time
	try:
		decoded_data = json.loads(config_array)
		configuration = ""
		for i in range(0, len(decoded_data)):
			value = decoded_data[i]
			configuration += value + '\n'
		configuration += "import os.path" + '\n'
		configuration += "oc_webdav_endpoint = os.path.join(oc_root,'remote.php/webdav')" + '\n'
		configuration += "oc_server_datadirectory = os.path.join('/var/www/html',oc_root, 'data')" + '\n'
		configuration += "del os" + '\n'
		with io.open('smashbox/etc/smashbox.conf', 'w', encoding='utf-8') as f:
			f.write(configuration)
		response("ok")
	except Exception, e:
		response("error: %s" % e)	
		
def main(tests_array):	
	if(get_lock()==1):
		finish_test(tests_array = tests_array)
		write_to_json_file(tests_array, file ='test_array.json')
		run(tests_array)
	else:
		response(0)
		
def check_lock():	
	if(get_lock()==1):
		response(1)
	else:
		get_progress()

if __name__ == '__main__':
	try:
		form = cgi.FieldStorage() 
		case = form.getvalue("function")
		if case == "check_status":
			check_lock() 
		elif case == "get_conf":
			get_conf(form.getvalue("hide_sensitive"))
		elif case == "get_conf_status":
			get_conf_status()
		elif case == "run":
			main(json.loads(form.getvalue("test")))
		elif case == "set_conf":
			set_conf(form.getvalue("config"))
		elif case =="get_test_details":
			get_test_details(form.getvalue("config"))
		elif case == "delete_conf":
			delete_conf()
   		elif case == "get_tests_list":
   			get_tests_list()
   		elif case == "stop_test":
   			stop_test()
   		elif case == "get_progress":
   			get_progress()
   		elif case == "get_history":
   			get_history()
   	except Exception,e:
   		response("error: %s" % e)



