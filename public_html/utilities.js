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

function isEmpty(ob){
	   for(var i in ob){ return false;}
	  return true;
}

function isArray(object)
{
 if (object.constructor === Array) return true;
 else return false;
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

function insert_info_bar(div_id, info_text, width_style){
	document.getElementById(div_id).innerHTML += '<p id="info_bar"><a >[?]<span style="width: '+width_style+';">'+info_text+'</span></a></p>';
}

function check_checkbox(id){
	var element = document.getElementById(id);
	if(element.value == "True"){
		element.value = "False";
	}else{
		element.value = "True";
	}
}