// tabulator.js
import { tabledata, botonCellFormatter } from './precios.js'; // Importa tabledata desde precios.js

 //create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#tabla_tabulator", {
	//maxHeight:"100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    width:"100%",
    data:tabledata, //assign data to table
 	layout:"fitDataFill", //fit columns to width of table (optional)
	headerVisible: false,
	resizableColumns: false, 
 	columns:[ //Define Table Columns
		//{title:"Paquete", field:"nombre", width: "25%", hozAlign:"left", cssClass:"negrita-paquete"},
		{title:"Imágenes", field:"cxt", width: "26%", hozAlign:"center"},		
		{title:"Costo", field:"paquete", width: "21%", hozAlign:"center"},	 	
	 	{title:"Costo por Imagen", field:"costo", width: "26%", hozAlign:"center"},
		{
            title:"Acción", // Título de la columna
            field:"boton_texto", // Usa un campo existente para que Tabulator lo asigne
            formatter: botonCellFormatter, // <-- Aquí usas la función de formato
            hozAlign:"center",
            width: "26%", // Ajusta el ancho según necesites
            headerSort:false // Evita que se ordene por esta columna
        },	
 	],
});