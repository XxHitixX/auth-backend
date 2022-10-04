
//Importaciones
const express = require('express');
const cors = require('cors');
const { dbconnection } = require('./db/config');
//El paquete dotenv configura todo lo de las variables de entorno y se instalo desde el npm
require('dotenv').config();
const path = require('path')

//Con esto puede ver las variables de entorno que estan corriendo actualmente
//console.log(process.env)

//Crear la aplicacion/servidor de express
const app = express();

//Conexion con la base de datos
dbconnection();

//middleware que permite servir una pagina html desde el backend
//Anotacion importante desde la carpeta public puedo poner toda mi aplicacion de Angular
app.use( express.static('public') );

// CORS
app.use(cors());

//Lectura y parseo del body por medio de los middleware
app.use( express.json() )

//RUTAS
//enlace del middleware con las rutas que estan exportadas en el auth
app.use('/api/auth', require('./routes/auth'))
//en caso de que nuestro servidor no nos permita modificar las rutas con angular
//es necesario realizar esta configuracion para adaptarla 
app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
} )


//Con la propiedad process.env puedo acceder a las variables de entorno y el PORT fué el que
//declaré en el archivo .env de variables de entorno
app.listen(process.env.PORT, ()=>{
    console.log(`Corriendo en el puerto ${process.env.PORT}`)
})