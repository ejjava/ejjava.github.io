<?php
$n=file_get_contents('tongji.txt');
$n++;
file_put_contents('tongji.txt',$n);
echo "document.write($n);";
?>