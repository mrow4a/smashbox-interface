<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<body>
	<div class="content_section_text">
		<p>Configuration file not found, please create one to start your work with smashbox</p></br> 
		<form "<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post" name="login" >
			<?php 
			
			function create_config($array) {
				foreach($array as $row)
				{
				    foreach($row as $key => $val)
				    {
				    	echo "<label for=".$key.">".$key.": </label>";
				    	if($key=='oc_account_password' || $key=='oc_admin_password'){
				    		$type = 'password';
				    	}
				    	else{
				    		$type = 'text';
				    	}
				    	
				    	if ($key=='oc_server_folder' || $key=='smashdir' || $key=='oc_sync_cmd'|| $key=='oc_server_tools_path'|| $key=='web_user'|| $key=='rundir_reset_procedure'){
				    		echo '<input type="url" name="oc_config" id="'.$key.'" size="35" value="' . $val. '" style="font-size: 10px;" />';
				    	}else if ($key=='oc_ssl_enabled' || $key=='workdir_runid_enabled' || $key=='oc_account_runid_enabled'){
				    		echo '<input type="checkbox" name="oc_config" id="'.$key.'" value="' . $val. '" onchange=check_checkbox(this.id) '.($val == 'True' ? "checked" : "").'/>';
				    	}
				    	else{
				    		echo '<input type="'.$type.'" name="oc_config" id="'.$key.'" size="35" value="' . $val. '" style="font-size: 10px;" onfocus=conf_form_focus(this.id,"' . $val. '") onblur=conf_form_blur(this.id,"' . $val. '") />';
				    	}
				    	
				        echo '</br>';
				    }
				}
			}
			
			$credentials_array = array(
					array('oc_account_name' => 'oc_account_name'),
					array('oc_account_password' => 'oc_account_password'),
					array('oc_server' => 'oc_server'),
					array('oc_server_folder' => 'testfolder'),
					array('smashdir' => '/var/www/smashbox/cgi-bin/tests')
			);
			$server_array = array(
					array('oc_ssl_enabled' => 'True'),
					array('oc_root' => ''),
					array('oc_sync_cmd' => '/usr/bin/owncloudcmd --trust'),
					array('oc_admin_user' => 'oc_admin_user'),
					array('oc_admin_password' => 'oc_admin_password'),
					array('oc_server_shell_cmd' => ''),
					array('oc_server_tools_path' => "server-tools"),
					array('web_user' => 'www-data')
			);
			
			$sharing_array = array(
					array('oc_number_test_users' => 3),
					array('oc_number_test_groups' => 1),
					array('oc_group_name' => 'None')
			);
			
			$additional_array = array(
					array('workdir_runid_enabled' => 'True'),
					array('oc_account_runid_enabled' => 'False'),
					array('pycurl_verbose' => 'None'),
					array('scp_port' => 22),
					array('rundir_reset_procedure' => "delete"),
					array('oc_account_reset_procedure' => "delete"),
					array('oc_sync_repeat' => 1),
					array('runid' => 'None')
			);
			echo '<div class="section_header section_header_grey"><span style="display: inline;">Credentials configuration</span></div>';
			create_config($credentials_array);
			echo '</br><div class="section_header section_header_grey"><span style="display: inline;">Server configuration </span></div>';
			create_config($server_array);
			echo '</br><div class="section_header section_header_grey"><span style="display: inline;">Sharing configuration </span></div>';
			create_config($sharing_array);
			echo '</br><div class="section_header section_header_grey"><span style="display: inline;">Additional configuration </span></div>';
			create_config($additional_array);
			//echo '</br>';
			?>                  
			<button type="button" class="button" onClick="smashbox_configuration_form()">&nbsp;Register&nbsp;</button>
		</form>
	</div>
</body>
</html>
