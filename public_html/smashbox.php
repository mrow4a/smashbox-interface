<?php
	function smash($args) {

		$fd = fopen("http://" . $_SERVER['SERVER_NAME'] . "/test/smashbox.py" . $args ,"r");
		$content = stream_get_contents($fd);
		fclose($fd);
		return $content;
	}
	
	function status_to_msg($args) {
		if ($args == 1) {
			return "ready to start tests";
		}
		else {
			return $args;
		}
	}


	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		if($_GET['function']){
			switch ($_GET['function']){
				case "check_status":
					$smash_msg = smash("?function=".$_GET['function']);
					echo status_to_msg($smash_msg);
					break;
				case "get_conf":
					if($_GET['hide_sensitive']){
						$hide_sensitive = (string)$_GET['hide_sensitive'];
					}
					else {
						$hide_sensitive = "False";
					}
					$smash_msg = smash("?function=".$_GET['function']."&hide_sensitive=".$hide_sensitive);
					echo $smash_msg;
					break;
				case "get_conf_status":
				case "get_progress":
				case "stop_test":
				case "get_history":
				case "get_tests_list":
				case "get_tests_list":
				case "delete_conf":
					$smash_msg = smash("?function=".$_GET['function']);
					echo $smash_msg;
					break;
				case "set_conf":
					$smash_msg = smash("?function=".$_GET['function']."&config=".$_GET['test']);
					echo $smash_msg;
					break;
				case "run":
					smash("?function=".$_GET['function']."&test=".$_GET['test']);
					break;
				default:
					echo "PHP GET FUNCTION ERROR";
			}
			
		}
	}
	
?>


