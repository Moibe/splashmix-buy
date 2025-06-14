//define some sample data
 var tabledata = [
 	{id:1, nombre: "Premium", paquete:"$10 USD", costo:"12", cxt:"🪙10 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 	{id:2, nombre: "Premium", paquete:"$20 USD", costo:"1", cxt:"🪙10 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 	{id:3, nombre: "Premium", paquete:"$40 USD", costo:"42", cxt:"🪙10 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 	{id:4, nombre: "Premium", paquete:"$80 USD", costo:"125", cxt:"🪙10 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 	{id:5, nombre: "Premium", paquete:"$100 USD", costo:"16", cxt:"🪙10 imágenes", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
 ];

 //create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#tabla_tabulator", {
    hozAlign:{hozAlign:"center", resizable:false, frozen:true},
	
	maxHeight:"100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    width:"100%",
    data:tabledata, //assign data to table
 	layout:"fitColumns", //fit columns to width of table (optional)
 	columns:[ //Define Table Columns
		{title:"Nombre", field:"nombre", headerHozAlign:"center", hozAlign:"center", cssClass:"negrita-paquete"},
	 	{title:"Costo", field:"paquete", headerHozAlign:"center", hozAlign:"center", cssClass:"negrita-paquete"},
	 	{title:"Imágenes", field:"costo", headerHozAlign:"center", hozAlign:"center"},
	 	{title:"$ por Imagen", field:"cxt", headerHozAlign:"center", hozAlign:"center"},
	 	{title:"Transformaciones", field:"boton", formatter:"html", headerHozAlign:"center", hozAlign:"center"},
 	],
});