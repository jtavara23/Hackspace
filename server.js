'use strict'
// REQUERIMIENTO DE MODULOS
var express =  require('express');
var swig = require('swig');
// Requerimiento de mongoose
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//CONFIGURACIONES
// Creación del servidor web con express
var server = express();
// Integracion del motor de templates swig
server.engine('html',swig.renderFile);
server.set('view engine', 'html');
server.set('views', __dirname + '/views');
swig.setDefaults({cache: false});
// Seteo de dirección de carpeta de archivos estaticos
server.use(express.static(__dirname + '/public'));
//Integracion de bodyParser
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Importacion de rutas
//you're telling express not to parse the body content 
//until after the middleware in main.js is run.
require('./routers')(server);

// CONFIGURACIONES DB
// Integración de mongoose
//mongoose.connect('mongodb://localhost/hackspace', { useMongoClient: true });
mongoose.connect('mongodb://jtavara23:JGti2323@ds129641.mlab.com:29641/hackspace', { useMongoClient: true });
mongoose.Promise = global.Promise


// INICIAR SERVIDOR
// Se corre el servidor en el puerto 8000
/*
server.listen(8000, function() {
	console.log('El servidor esta escuchando en el puerto '+ 8000)
}); 
*/

server.listen(process.env.PORT || 5000, function () {
	console.log('El servidor esta escuchando en el puerto ' + 5000)
});
