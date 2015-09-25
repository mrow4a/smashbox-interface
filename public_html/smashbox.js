
function new_ajax_request(){
	var ajaxRequest;  // The variable that makes Ajax possible!
	
	try{
		// Opera 8.0+, Firefox, Safari
		ajaxRequest = new XMLHttpRequest();
	} catch (e){
		// Internet Explorer Browsers
		try{
			ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				// Something went wrong
				alert("Your browser broke!");
				return false;
			}
		}
	}
	return ajaxRequest;
}

function get_smashbox_status(){
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			document.getElementById("smashbox_status").innerHTML = ajaxRequest.responseText;
		}
		else{
			document.getElementById("smashbox_status").innerHTML = "loading..";
		}
		smashbox_prepare_test_enable();
	}
	ajaxRequest.onerror = function(e) {
    		alert("Error Status: " + e.target.status);
	}
	ajaxRequest.open("GET", "smashbox.php?function=check_status", true);
	ajaxRequest.send();
}

function get_smashbox_conf(hide_sensitive){
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			document.getElementById("conf_details").innerHTML = ajaxRequest.responseText;
		}
		else{
			document.getElementById("conf_details").innerHTML = "loading..";
		}
	}
	ajaxRequest.onerror = function(e) {
    		alert("Error Status: " + e.target.status);
	}
	ajaxRequest.open("GET", "smashbox.php?function=get_conf&hide_sensitive="+hide_sensitive, true);
	ajaxRequest.send();
}

function hide_sensitive(){
	if(document.getElementById("hide_sensitive_button").value == "Show sensitive"){
		document.getElementById("hide_sensitive_button").value = "Hide sensitive";
		get_smashbox_conf("False");
	}
	else{
		document.getElementById("hide_sensitive_button").value = "Show sensitive";
		get_smashbox_conf("True");
	}
		
}

function conf_details_fun() {
	if(document.getElementById("conf_details_div").style.display == 'none'){
		get_smashbox_conf("True");
		document.getElementById("conf_details_div").style.display = 'inline';
		document.getElementById("conf_details_header_img").src="lib/dropup.png";
	}
	else{
		document.getElementById("conf_details_div").style.display = 'none';
		document.getElementById("conf_details_header_img").src="lib/dropdown.png";
	}
}

function conf_status_details_fun(){
	if (document.getElementById("smashbox_conf_status_details").style.display == 'none'){
		get_smashbox_conf_status();
		document.getElementById("smashbox_conf_status").innerHTML = "OK - click for details";
		document.getElementById("smashbox_conf_status_details").style.display = 'block';
	}else{
		get_smashbox_conf_status();
		document.getElementById("smashbox_conf_status").innerHTML = "OK - click to hide details";
		document.getElementById("smashbox_conf_status_details").style.display = 'none';
	}
}
function get_smashbox_conf_status(){
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			var array = ajaxRequest.responseText;
			if(array.search("200 OK")== -1){
				document.getElementById("smashbox_conf_status").innerHTML = "ERROR - click for details";
			}else {
				if (document.getElementById("smashbox_conf_status_details").style.display == 'none'){
					document.getElementById("smashbox_conf_status").innerHTML = "OK - click for details";
				}else{
					document.getElementById("smashbox_conf_status").innerHTML = "OK - click to hide details";
				}
			}
			document.getElementById("smashbox_conf_status_details").innerHTML = array;
			smashbox_prepare_test_enable();
		}
		else{
			document.getElementById("smashbox_conf_status_details").innerHTML = "";
			document.getElementById("smashbox_conf_status").innerHTML = "loading..";
		}
	}
	ajaxRequest.onerror = function(e) {
    		alert("Error Status: " + e.target.status);
	}
	ajaxRequest.open("GET", "smashbox.php?function=get_conf_status", true);
	ajaxRequest.send();
	
}


function smashbox_prepare_test_enable(){
	smashbox_conf_status=document.getElementById("smashbox_conf_status").innerHTML;
	smashbox_status=document.getElementById("smashbox_status").innerHTML;
	if(smashbox_conf_status.search("OK")!= -1 && smashbox_status.search("start")!= -1){
		if(document.getElementById("prepare_test_button").disabled){ 
			document.getElementById("prepare_test_button").removeAttribute("disabled");
		}
	}
	else{
		document.getElementById("prepare_test_button").setAttribute("disabled", "disabled");
	}
	
	
}

function check_all(){
	checkboxes = document.getElementsByName('test_checkbox');
	var source_check = document.getElementById('check_all').checked;
	for(var i=0, n=checkboxes.length;i<n;i++) {
	    checkboxes[i].checked = source_check;
	}
	
}

function hide_test_section(){
	document.getElementById("test_details_div").innerHTML = "";
	document.getElementById("test_progress_details_div").innerHTML = "";
	init();
}

function isEmpty(ob){
	   for(var i in ob){ return false;}
	  return true;
	}

function get_test_progress() {
	//alert('called');
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onerror = function(e) {
    		alert("Error Status: " + e.target.status);
	}
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			var response =ajaxRequest.responseText;
			//document.getElementById("test_progress_details_div").innerHTML = response;
			var server_name = "";
			var test_finished = 0;
			if (response.search("omitting-get-progress") == -1){
				var obj = JSON.parse(response);
				for(var key in obj) {
				    if(obj.hasOwnProperty(key)) {
				    	if (key!="info"){
				    		server_name = key;
				    	}else if(key=="info" && obj["info"]=="test finished"){
				    		test_finished = 1;
				    	}else if(key == "info" && obj["info"]!="stop"){
				    		document.getElementById("test_details").innerHTML = "Script run... PID: " + obj["info"];
				    	}
				    }
				}
				if(server_name == ""){
					alert("test error - stop the test!");
				}
				else{
					//access server
					obj = obj[server_name];
					for(var key in obj) {
					    if(obj.hasOwnProperty(key)) {
					    	//access the test instance in the json file
					    	var test_instance = obj[key];
					    	var test_instance_row = document.getElementById(key);
					    	//check results of the test
					    	var check_test_status = 0;
					    	test_instance_result_cell = test_instance_row.cells[2];
					    	test_instance_result_cell.innerHTML = "";
					    	
					    	for (var i in test_instance) {
					    		var test_results = test_instance[i]["results"];
					    		var test_scenario = JSON.stringify(test_instance[i]["scenario"]);
					    		var test_time = test_instance[i]["time"];
					    		if( isEmpty(test_results) ){
					    			check_test_status = 1;
					    		}else{
						    		test_instance_result_cell.innerHTML += "<b>Test time:</b> " + test_time + "</br><b>Scenario:</b> " + test_scenario;
					    			test_instance_result_cell.innerHTML += "</br><b>Exec time:</b> " + test_results["exec_time"];
					    			if(test_results.hasOwnProperty("errors")){
					    				var test_error_length = test_results["errors"].length;
					    				for (var i = 0; i < test_error_length; i++) {
					    					test_instance_result_cell.innerHTML += "</br><b>Error: </b>"+test_results["errors"][i]["message"];
					    				}
					    				test_instance_result_cell.innerHTML += "</br><b style=\"color: red;\">Failed</b> ";
					    			}
					    			else{
					    				test_instance_result_cell.innerHTML += "</br><b style=\"color: green;\">Passed</b> ";
					    			}
					    			test_instance_result_cell.innerHTML += "</br>--------</br>";
					    		}
					    	}
					    	
					    	if(check_test_status == 0){
						    	test_instance_row.cells[1].innerHTML = "done";
					    	}else{
						    	test_instance_row.cells[1].innerHTML = "pending";
					    	}
					    	//document.getElementById("test_progress_details_div").innerHTML = key;
					    }
					}
				}
				
	
		    	
				if (test_finished == 1){
					clearInterval(document.getElementById("test_id").innerHTML);
					document.getElementById("stopTestButton").value = " Hide section ";
					document.getElementById("stopTestButton").setAttribute( "onClick", "javascript:  hide_test_section();" );
					document.getElementById("test_progress_status").innerHTML = "Test finished";
					init();
				}else{
					document.getElementById("test_progress_status").innerHTML = "Do not refresh, test in progress..";
				}
			}
		}
	}
	ajaxRequest.open("GET", "smashbox.php?function=get_progress", true);
	ajaxRequest.send();
}

function init_test_layout(array){
	table = document.getElementById("test_table");
	table.style.display = 'block';
	var arrayLength = array.length;
	for (var i = 0; i < arrayLength; i++) {
		test_name = "test_" + array[i] + ".py";
		var row = table.insertRow(-1);
		row.setAttribute("id", test_name, 0);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		cell1.innerHTML = test_name;
		cell2.innerHTML = "waiting";
	}
}

function stopTest() { // call this to stop your interval.
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onerror = function(e) {
    		alert("Error Status: " + e.target.status);
	}
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			if(ajaxRequest.responseText.search("ok")== -1){
				alert(ajaxRequest.responseText);
			}
		}
	}
	ajaxRequest.open("GET", "smashbox.php?function=stop_test", true);
	ajaxRequest.send();
	clearInterval(document.getElementById("test_id").innerHTML);
	hide_test_section();
}

function submitTests(){
	var ajaxRequest = new_ajax_request();
	var array = [];
	
	checkboxes = document.getElementsByName('test_checkbox');
	for(var i=0, n=checkboxes.length;i<n;i++) {
	    if(checkboxes[i].checked){
	    	array.push(checkboxes[i].value);
	    }
	}
	var json = encodeURIComponent(JSON.stringify(array));
	ajaxRequest.open("GET", "smashbox.php?function=run&test="+json, true);
	ajaxRequest.send();
	var interval = setInterval(get_test_progress, 1000);
	document.getElementById("test_details_div").innerHTML = "<div><b>Test id: </b>"+"<span id=\"test_id\">"+interval +"</span></br>";
	document.getElementById("test_details_div").innerHTML += "<b>Test details: </b>"+"<span id=\"test_details\">loading..</span></br>";
	document.getElementById("test_details_div").innerHTML += "<b>Test progress: </b></div>"+"<span id=\"test_progress_status\">loading..</span></br></br>"
	document.getElementById("test_details_div").innerHTML += "<input type=\"button\" id = \"stopTestButton\" value = \" Stop test \" onclick=\"stopTest()\" ></input>";
	document.getElementById("test_details_div").innerHTML += "<div id=\"test_progress\"></div>";
	
	document.getElementById("test_progress").innerHTML += "</br><table id=\"test_table\"><tr><th><b>Test name</b></th><th><b>Status</b></th><th style=\"width:100%; white-space: normal;\"><b>Result</b></th></tr></table>";
	init();
	init_test_layout(array);
}

function check_if_text(element){
	if(isNaN(element) && element != "None" && element != "True" && element != "False"){
		return "\"" + element + "\"";
	}
	else{
		return element;
	}
}

function smashbox_configuration_form (form) {
	var ajaxRequest = new_ajax_request();
	var array = [];
	var elements = document.getElementsByName('oc_config');
	for(var i=0, n=elements.length;i<n;i++) {
			
			var config_pair= elements[i].id + "\=" +check_if_text(elements[i].value);
	    	array.push(config_pair);
	}
	var json = encodeURIComponent(JSON.stringify(array));
	alert(json);
	ajaxRequest.open("GET", "smashbox.php?function=set_conf&test="+json, true);
	ajaxRequest.send();
}

function test_form(responseText){
	var array = responseText;
	var obj = array.split(",");
	var test = "";
	document.getElementById("test_details_div").innerHTML = '<div style="border-bottom: 1px solid;" ><input type="checkbox" id="check_all" name="check_all" onclick="check_all()" checked >&#09<b>Test name</b></div><form name="test_form"><div style="padding: 5px 0px 0px 0px;">';
	for (i = 0; i < obj.length; i++) { 
		test = obj[i].replace(".py", "");
		test = test.replace("test_", "");
		test = test.replace(/[^a-zA-Z0-9]/g, "");
		if(test != "README"){
			document.getElementById("test_details_div").innerHTML += '<span style="padding: 0px 0px 2px 5px;">&nbsp;</span><input type="checkbox" name="test_checkbox" value="'+ test +'">&#09' + test + '<br>';
		}
	}
	
	document.getElementById("test_details_div").innerHTML += '</br><input type="button" value=" Run test " name="testButton" onClick="submitTests()">&#09<input type="button" value=" Hide section " name="hideTestButton" onClick="hide_test_section()"></div></form></br></br>';
	check_all();
	
	
}

function smashbox_prepare_test(){
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			test_form(ajaxRequest.responseText);
		}
		else{
			document.getElementById("test_details_div").innerHTML = "loading..";
		}
	}
	ajaxRequest.onerror = function(e) {
    		alert("Error Status: " + e.target.status);
	}
	ajaxRequest.open("GET", "smashbox.php?function=get_tests_list", true);
	ajaxRequest.send();
	
}

function init(){
	get_smashbox_status();
	get_smashbox_conf_status();
}


init();