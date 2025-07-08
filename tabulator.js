// tabulator.js
import { tabledata, botonCellFormatter } from './precios.js'; // Importa tabledata desde precios.js

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
		{
            title:"Acción", // Título de la columna
            field:"boton_texto", // Usa un campo existente para que Tabulator lo asigne
            formatter: botonCellFormatter, // <-- Aquí usas la función de formato
            hozAlign:"center",
            width: 150, // Ajusta el ancho según necesites
            headerSort:false // Evita que se ordene por esta columna
        },	
	 	//{title:"Transformaciones", field:"boton", width: "15%", formatter:"html", headerHozAlign:"right", hozAlign:"right"},
 	],
});