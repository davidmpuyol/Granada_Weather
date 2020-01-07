<?php
    $codigo = $_GET["codigo"];
    $datos = file_get_contents("http://www.aemet.es/xml/municipios/localidad_".$codigo.".xml");
    //$xml = simplexml_load_file("http://www.aemet.es/xml/municipios/localidad_18017.xml");
    echo $datos;
?>