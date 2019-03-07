<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>ajax</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="zh-CN" />
<meta name="Keywords" content="" />
<meta name="Description" content="" />
<script type="text/javascript" src="./js/jquery-1.7.1.min.js"></script>
</head>
<body>
	<script>
$(document).ready(function(){
$.ajax({
type: "POST",
url: "ajaxReciver.php",
dataType: "html",
data: {"user":"nice","pass":"sj"},
success: function(data){
$("#test").html(data);
alert(data);
},
error:function(){
alert("F");
return false;
}
});
});
</script>
	<div id="test"></div>
</body>
</html>