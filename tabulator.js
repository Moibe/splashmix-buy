//define some sample data
 var tabledata = [
 	{id:1, nombre: "🃏 Standard", paquete:"$10 USD", costo:"$1.00 x imagen", cxt:"🃏10 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 	{id:2, nombre: "💿💿 Silver", paquete:"$20 USD", costo:"$0.75 x imagen", cxt:"🃏26 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 	{id:3, nombre: "🪙🪙🪙 Gold", paquete:"$40 USD", costo:"$0.50 x imagen", cxt:"🃏80 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 	{id:4, nombre: "💎💎💎💎 Diamond", paquete:"$80 USD", costo:"$0.25 x imagen", cxt:"🃏320 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 	{id:5, nombre: "🪅🪅🪅🪅🪅 Awesome", paquete:"$100 USD", costo:"$0.10 x imagen", cxt:"🃏1000 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 ];

 //create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#tabla_tabulator", {
    hozAlign:{hozAlign:"center", resizable:false, frozen:true},
	
	maxHeight:"100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    width:"100%",
    data:tabledata, //assign data to table
 	layout:"fitDataFill", //fit columns to width of table (optional)
	headerVisible: false, 
 	columns:[ //Define Table Columns
		{title:"Paquete", field:"nombre", width: "30%", widthGrow:4, headerHozAlign:"center", hozAlign:"left", cssClass:"negrita-paquete"},
		{title:"Costo", field:"paquete", width: "12%", headerHozAlign:"left", hozAlign:"left"},
	 	{title:"Imágenes", field:"cxt", width: "20%", headerHozAlign:"left", hozAlign:"left"},
	 	{title:"Costo por Imagen", field:"costo", width: "20%", headerHozAlign:"left", hozAlign:"right"},	
	 	{title:"Transformaciones", field:"boton", width: "15%", formatter:"html", headerHozAlign:"right", hozAlign:"right"},
 	],
});