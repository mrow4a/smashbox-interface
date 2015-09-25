<?php
	session_start();
	$dir = realpath('/var/www/smashbox/cgi-bin/smashbox/etc/smashbox.confr');
	if (file_exists($dir)) {
		$_SESSION['Login']=1;         
	}
	else {
		$_SESSION['Login']=0;
	}
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Smashbox</title>
		<link href="lib/style.css" rel="stylesheet" type="text/css" media="screen" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<script language="javascript" type="text/javascript" src="../smashbox.js"></script>
	</head>
	<body>
	<div class="main_page">
		<div class="content_section">
			<div class="section_header section_header_red">
				<div id="about">Smashbox</div>
			</div>
			<?php
				if($_SESSION['Login']==0)
				{
					include ('register.php'); 
				}
				else if($_SESSION['Login']==1)
				{
					include ('smashbox.html'); 
				}
			?>
		</div>
	</div>
	</body>
</html>

