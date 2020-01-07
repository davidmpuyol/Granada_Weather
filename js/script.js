function comprobarCodigoPostal(event){
    if(event.target.value.length>=3){
        let buscar = event.target.value.toUpperCase();
        var xmlhttp = new XMLHttpRequest();
        let datos = cp.value;
        xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                mostrarProvincias(this,buscar);
            }
        };
        xmlhttp.open("GET", "./xml/codigos.xml",true);
        xmlhttp.send();
    }
}

    function mostrarProvincias(xml,buscar){
        xml = xml.responseXML;
        document.getElementById("codigos").innerHTML = "";
        let pueblos = xml.getElementsByTagName("fila");
        let lista = document.createElement("ul");
        for(let i = 0; i<pueblos.length; i++){
            var salida = "";
            let pueblo = pueblos[i].getElementsByTagName("poblacion")[0].innerHTML.toUpperCase();
            let cp = pueblos[i].getElementsByTagName("codigo")[0].innerHTML;
            if(pueblo.includes(buscar) || cp.includes(buscar)){
                lista.appendChild(crearSeleccionable(pueblo,cp));
            }
        }
        document.getElementById("codigos").appendChild(lista);
    }
    function crearSeleccionable(poblacion,cp){
        let elemento = document.createElement("li");
        elemento.appendChild(document.createTextNode(poblacion));
        elemento.cp = cp;
        elemento.poblacion =poblacion;
        elemento.onclick = seleccionar;
        return elemento;
    }

    function seleccionar(event){
        cp.value = event.target.innerText;
        document.codigoseleccionado = event.target.cp;
        document.puebloseleccionado = event.target.poblacion;
    }

    function cargarDatos(){
        document.getElementById("datos-tiempo").innerHTML = "";
        document.getElementById("tiempo-titulo").innerHTML = "";
        let codigo = document.codigoseleccionado;
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                gestionarDatos(this.responseText);
            }
        };
        xmlhttp.open("GET", "./php/consultartiempo.php?codigo="+codigo,true);
        xmlhttp.send();
        }

    function gestionarDatos(datos){
        let parser = new DOMParser();
        xml = parser.parseFromString(datos,"text/xml");
        let titulo = document.createElement("h2");
        titulo.innerHTML = "El tiempo en "+document.puebloseleccionado;
        document.getElementById("tiempo-titulo").appendChild(titulo);
        let dias = xml.getElementsByTagName("dia");
        dias = Array.from(dias);
        dias.shift();
        dias.forEach(dia => {
            crearCelda(dia);
        })
    }

    function crearCelda(dia){
        let div = document.createElement("div");
        div.className="prediccion-dia";
        let titulo = document.createElement("h4");
        titulo.className ="fecha";
        let diafecha = new Date(dia.getAttribute("fecha"));
        var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
        titulo.innerHTML = diasSemana[diafecha.getDay()] + ", " + diafecha.getDate() + "/" + (diafecha.getMonth()+1);
        div.appendChild(titulo);
        //Estado del cielo
        let estado = document.createElement("p");
        estado.className ="estado";
        estado.innerHTML = "Estado del cielo: "+dia.getElementsByTagName("estado_cielo")[0].getAttribute("descripcion");
        let imagen = document.createElement("img");
        imagen.src = "./images/"+dia.getElementsByTagName("estado_cielo")[0].getAttribute("descripcion")+".png";
        div.appendChild(estado);
        div.appendChild(imagen);
        //Probabilidad de lluvia
        let lluvia = document.createElement("p");
        lluvia.className = "lluvia";
        lluvia.innerHTML = "Probabilidad de lluvia: "+dia.getElementsByTagName("prob_precipitacion")[0].innerHTML+"%";
        div.appendChild(lluvia);
        //Viento
        let viento = document.createElement("p");
        viento.className = "viento";
        viento.innerHTML = "Viento: "+dia.getElementsByTagName("viento")[0].getElementsByTagName("velocidad")[0].innerHTML + " km/h";
        div.appendChild(viento);
        document.getElementById("datos-tiempo").appendChild(div);
    }