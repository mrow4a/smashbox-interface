<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<body>
	
	<div class="content_section_text">
		<p>Configuration file not found, please create one to start your work with smashbox</p></br> 
		<form "<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post" name="login" >
			<label for="oc_account_name">Account name:</label>
            <input type="text" class="input" name="oc_config" id="oc_account_name" size="15" value="username" style="font-size: 10px;" onfocus="if (this.value=='username')this.value='';" onblur="if (this.value=='')this.value='username';" />
			</br>  
            <label for="oc_account_password">Password:</label>
            <input type="password" class="input" name="oc_config" id="oc_account_password" size="15" value="password" style="font-size: 10px;" onfocus="if (this.value=='password')this.value='';" onblur="if (this.value=='')this.value='password'" />
			</br>                        
			<button type="submit" class="button" onClick="smashbox_configuration_form()">&nbsp;Register&nbsp;</button>
		</form>
	</div>
</body>
</html>
