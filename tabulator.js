// tabulator.js
import { tabledata } from './tablas_precio.js'; 
import { botonCellFormatter } from './precios.js'; // Importa tabledata desde precios.js

 //create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#tabla_tabulator", {
    width:"100%",
    data:tabledata, //assign data to table
 	layout:"fitDataFill", //fitData: extiende la columna aunque tenga q salir un scroll abajo. fitDataFill: extiende la columna mientras no se pase del ancho asignado.
	headerVisible: false,
	resizableColumns: false, 
 	columns:[ //Define Table Columns
		{title:"", field:"cxt", width: "26%", headerHozAlign:"center", headerSort: false, hozAlign:"center", vertAlign:"middle"}, //, cssClass:"first-column-padding"		
		{title:"", field:"paquete", width: "20%", headerHozAlign:"center", headerSort: false, hozAlign:"center", vertAlign:"middle"},	 	
	 	{title:"", field:"costo", width: "27%", headerHozAlign:"center", headerSort: false, hozAlign:"center", vertAlign:"middle"},
		{
            title:"", // Título de la columna
            field:"boton_texto", // Usa un campo existente para que Tabulator lo asigne
            formatter: botonCellFormatter, // <-- Aquí usas la función de formato
            hozAlign:"center",
            width: "27%", // Ajusta el ancho según necesites
            headerSort:false,
			vertAlign:"middle"
        },	
 	],
});