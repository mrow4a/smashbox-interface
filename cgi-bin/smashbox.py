#!/usr/bin/python

# Import modules for CGI handling 
import cgi, cgitb 
import subprocess
import os
import socket

def rm_file(f_name):
	if(os.path.exists(f_name)):
		os.remove(f_name)

def get_lock():
	process_name = 'running_test'		
    	global lock_socket   # Without this our lock gets garbage collected
    	lock_socket = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    	try:
        	lock_socket.bind('\0' + process_name)
        	return 1
    	except socket.error:
        	return 0

def check_lock():	
	if(get_lock()==1):
		response(1)
	else:
		response(0)
		
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

def run(tests_array):
	import time
	import json
	import io
	try:
		decoded_data = json.loads(tests_array)
		f_name = 'test_results.json'
		rm_file(f_name)
		commands = []
		for i in range(0, len(decoded_data)):
			test_cmd = "/var/www/smashbox/cgi-bin/smashbox/bin/smash --keep-going --all-testsets --keep-results /var/www/smashbox/cgi-bin/smashbox/lib/test_" + decoded_data[i] + ".py"
			commands.append(test_cmd)
		
		for cmd in commands:
			process = subprocess.Popen(cmd, shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE, preexec_fn=os.setsid)
			pid = os.getpgid(process.pid)
			while (not os.path.exists(f_name)):
				time.sleep(1)
			try:
				with io.open(f_name,'r') as file:
					data = json.load(file)
				if(data.has_key("info") and data["info"]=="stop"):
					stop_test_function(pid)
				else:
					data = update_json_info(data, pid)
					with io.open(f_name, 'w', encoding='utf-8') as f:
						f.write(unicode(json.dumps(data, ensure_ascii=False, indent=4)))
					process.wait()
			except IOError:
				process.wait()	
		
	except Exception, e:
		response("error: %s" % e)



def get_tests_list():
	print "Content-type:text/plain\r\n\r\n"
	from os import listdir
	from os.path import isfile, join
	test_path = '/var/www/smashbox/cgi-bin/smashbox/lib'
	onlyfiles = [ f for f in listdir(test_path) if isfile(join(test_path,f)) ]
 	print str(onlyfiles)

def stop_test():
	import json
	import io
	f_name = 'test_results.json'
	with io.open(f_name,'r') as file:
		data = json.load(file)
	if(data.has_key("info") and data["info"]!="stop" and data["info"]!="test finished"):
		pid = data["info"]
	data = update_json_info(data, "stop")
	with io.open(f_name, 'w', encoding='utf-8') as f:
		f.write(unicode(json.dumps(data, ensure_ascii=False, indent=4)))
	stop_test_function(pid)

def stop_test_function(pid):	
	import time
	import signal
	import json
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
 

def json_response(data):
	import json
	print "Content-type: application/json"
	print 
	print(json.JSONEncoder().encode(data))	

def get_progress():
	import io
	import json
	f_name = 'test_results.json'
	if(os.path.exists(f_name)):
		try:
			with io.open(f_name,'r') as file:
				data = json.load(file)
			if(data.has_key("info") and data["info"]!="stop" and data["info"]!="test finished"):
				if(get_lock()==1):
					data = update_json_info(data, "test finished")
					rm_file(f_name)
				json_response(data)
			else:
				response("omitting-get-progress")
		except IOError:
			response("omitting-get-progress")
	else:
		response("omitting-get-progress")

def delete_conf():
	rm_file('smashbox/etc/smashbox.conf')	
	response("ok")	
		
def set_conf(config_array):
	import json, re
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
		run(tests_array)
	else:
		response(0)
		


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
			main(form.getvalue("test"))
		elif case == "set_conf":
			set_conf(form.getvalue("config"))
		elif case == "delete_conf":
			delete_conf()
   		elif case == "get_tests_list":
   			get_tests_list()
   		elif case == "stop_test":
   			stop_test()
   		elif case == "get_progress":
   			get_progress()
   	except Exception,e:
   		response("error: %s" % e)



