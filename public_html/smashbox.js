
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




function init_history_layout(array, arrayLength, start_from){
	document.getElementById("test_history_div").innerHTML += "</br><table id=\"history_table\"><tr><th></th><th><b>Test id</b></th><th><b>Content</b></th><th style=\"width:100%; white-space: normal;\"><b>Result</b></th></tr></table>";
	table = document.getElementById("history_table");
	table.style.display = 'block';
	array.sort(function(a, b){
		a = a["info"][0];
		a = a.replace("-", "");
		b = b["info"][0];
		b = b.replace("-", "");
	    return b - a;
	});
	start_from=start_from*5;
	var finish = start_from+5;
	if(finish > arrayLength){
		finish = arrayLength;
	}
	
	for (var i = start_from; i < finish; i++) {
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);
		
		var test_id = array[i]["info"][0];
		cell1.innerHTML = "<input type='radio' id="+test_id+" class='radio-button' name='test_history_radio' onclick='get_test_details();'>";
		cell2.innerHTML = test_id;
		cell3.innerHTML = "";
		for (var j = 2; j < array[i]["info"].length; j++) {
			cell3.innerHTML += array[i]["info"][j]+"</br>";
		}
		cell4.innerHTML = array[i]["info"][1];
	}
}

function get_smashbox_results_history(selection){
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			var results_history = JSON.parse(ajaxRequest.responseText);
			var arrayLength = results_history.length;
			var max_size = 5;
			var div = (arrayLength/max_size>>0);
			if ((arrayLength % max_size)!=0){
				div += 1;
			}
			selection = parseInt(selection);
			document.getElementById("test_history_div").innerHTML = '<select id="test_history_select" onChange="get_smashbox_results_history(this.options[this.selectedIndex].value);"></select></br>';
			init_history_layout(results_history, arrayLength, selection);
			document.getElementById("test_history_div").innerHTML += "</br>Page " + (selection+1) + " from " + div;
			
			var select = document.getElementById("test_history_select");
			var option = document.createElement("option");
			option.text = "Select group of results";
			option.value = 0;
			select.appendChild(option);
			for (var i = 0; i < div; i++) {
				var option = document.createElement("option");
				var option_text_value = (i*5)
				if((option_text_value+4)>arrayLength){
					option.text = option_text_value+"-"+(arrayLength);
				}else{
					option.text = option_text_value+"-"+(option_text_value+4);
				}
				option.value = i;
				select.appendChild(option);
			}
		}
		else{
			document.getElementById("test_history_div").innerHTML = "loading..";
		}
	}
	ajaxRequest.onerror = function(e) {
    		alert("Error Status: " + e.target.status);
	}
	ajaxRequest.open("GET", "smashbox.php?function=get_history", true);
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

function result_details_fun() {
	if(document.getElementById("result_details_div").style.display == 'none'){
		get_smashbox_results_history(0);
		document.getElementById("result_details_div").style.display = 'inline';
		document.getElementById("result_details_header_img").src="lib/dropup.png";
	}
	else{
		document.getElementById("result_details_div").style.display = 'none';
		document.getElementById("result_details_header_img").src="lib/dropdown.png";
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

function isArray(object)
{
    if (object.constructor === Array) return true;
    else return false;
}

function display_test_details(obj){
	var test_finished = 0;
	var server_name = "";
	for(var key in obj) {
	    if(obj.hasOwnProperty(key)) {
	    	if (key!="info"){
	    		server_name = key;
	    	}else if(key=="info" && obj["info"]=="test finished"){
	    		test_finished = 1;
	    	}else if(key == "info" && obj["info"]!="stop" && !isArray(obj["info"])){
	    		document.getElementById("test_details").innerHTML = "Script run... PID: " + obj["info"];
	    	}
	    }
	}
	if(server_name == ""){
		alert("test error!");
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
		    		var test_time = test_instance[i]["runid"];
		    		if( isEmpty(test_results) ){
		    			check_test_status = 1;
		    		}else{
			    		test_instance_result_cell.innerHTML += "<b>Runid:</b> " + test_time + "</br><b>Scenario:</b> " + test_scenario;
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
	return test_finished;
}

function init_test_layout(array){
	document.getElementById("test_details_div").innerHTML += "<div id=\"test_progress\"></div>";
	document.getElementById("test_progress").innerHTML += "</br><table id=\"test_table\"><tr><th><b>Test name</b></th><th><b>Status</b></th><th style=\"width:100%; white-space: normal;\"><b>Result</b></th></tr></table>";
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

function request_test_details(id){
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			var obj = JSON.parse(ajaxRequest.responseText);
			var tmp_array = obj["info"];
			var array = [];
			for (var i = 1; i < tmp_array.length; i++) {
				array.push(tmp_array[i]);
			}
			document.getElementById("test_details_div").innerHTML = "";
			init_test_layout(array);
			display_test_details(obj);
			document.getElementById("test_details_div").innerHTML += "</br><input type=\"button\" id = \"HideTestButton\" value = \" Hide section \" onclick=\"hide_test_section();\" ></input>";
		}
		else{
			//document.getElementById("conf_details").innerHTML = "loading..";
		}
	}
	ajaxRequest.onerror = function(e) {
    		alert("Error Status: " + e.target.status);
	}
	ajaxRequest.open("GET", "smashbox.php?function=get_test_details&test="+id, true);
	ajaxRequest.send();
}

function get_test_details(){
	var test_history_radio = document.getElementsByName('test_history_radio');
	var selected_id=null;
	for(var i = 0; i < test_history_radio.length; i++){
	    if(test_history_radio[i].checked){
	    	selected_id = test_history_radio[i].id;
	    }
	}
	if(selected_id===null){
		alert("Select test");
	}else{
		request_test_details(selected_id);
	}
	
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
			var test_finished = 0;
			if (response.search("omitting-get-progress") == -1){
				var obj = JSON.parse(response);
				test_finished = display_test_details(obj);
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
	ajaxRequest.open("GET", "smashbox.php?function=get_progress", true);
	ajaxRequest.send();
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

function get_test(array){
	var interval = setInterval(get_test_progress, 1000);
	document.getElementById("test_details_div").innerHTML = "<div><b>Test id: </b>"+"<span id=\"test_id\">"+interval +"</span></br>";
	document.getElementById("test_details_div").innerHTML += "<b>Test details: </b>"+"<span id=\"test_details\">loading..</span></br>";
	document.getElementById("test_details_div").innerHTML += "<b>Test progress: </b></div>"+"<span id=\"test_progress_status\">loading..</span></br></br>"
	document.getElementById("test_details_div").innerHTML += "<input type=\"button\" id = \"stopTestButton\" value = \" Stop test \" onclick=\"stopTest()\" ></input>";
	init_test_layout(array);
}

function get_smashbox_status(){
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			var smashbox_status = ajaxRequest.responseText;
			if(smashbox_status.search("ready to start tests") == -1){
				//alert(document.getElementById("test_details").innerHTML);
				//alert(smashbox_status);
				smashbox_status = "test already running";
			}
			document.getElementById("smashbox_status").innerHTML = smashbox_status;
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
	get_test(array);
	init();
}


function conf_form_focus(id, form_element){
	var element = document.getElementById(id);
	
	if(element.value == form_element || element.value == form_element.value){
		element.value = '';
	}
}

function conf_form_blur(id,form_element){
	element = document.getElementById(id);
	
	if(element.value == ''){
		element.value = form_element;
	}
}

function check_if_text(element){
	element = encodeURIComponent(element);
	
	if(isNaN(element) && element != "None" && element != "True" && element != "False"){
		return "\"" + element + "\"";
	}
	else if (element == ''){
		return "\"" + "\"";
	}
	else{
		return element;
	}
}

function delete_conf() {
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			window.location = "index.php";
		}
	}
	ajaxRequest.open("GET", "smashbox.php?function=delete_conf", true);
	ajaxRequest.send();
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
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			if(ajaxRequest.responseText.search("ok") != -1){
				window.location = "index.php";
			}else{
				alert(ajaxRequest.responseText);
			}
		}
	}
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

function check_checkbox(id){
	var element = document.getElementById(id);
	if(element.value == "True"){
		element.value = "False";
	}else{
		element.value = "True";
	}
}

function smashbox_prepare_test(){
	var ajaxRequest = new_ajax_request();
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4  && ajaxRequest.status == 200){
			hide_test_section();
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