'use strict'
// REQUERIMIENTO DE MODULOS
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router({ mergeParams: true });

// Requerimiento de modelo speciality
var Speciality = require('../models/speciality');
// Requerimiento de modelo user
var User = require('../models/user');


// PETICIONES
// GET HOME PAGE

router.route('/').get(function (req, res) {
    // Consulta al modelo Speciality en la base de datos.
    //obtnenemos de Speciality
    Speciality.find().then(
        function (especialidades) {//viene de la BD
           // console.log(especialidades);
            res.render('especialidades.html', { categorias: especialidades });
        }
    )
});
//Creacion de una instancia mediante DIRECCION URL
router.route('/agregar/:nombre/:imagen/').get(function (req, res) {
    //Obtencion de parametros de url
    var nombre = req.params.nombre;
    var imagen = req.params.imagen;
    //Crear una instancia del modelo speciality
    var speciality = new Speciality({ nombre: nombre, imagen: imagen })
    //Guardar instancia del modelo
    speciality.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            // Redireccion a home
            res.redirect('/');
        }
    });
});
// Creacion de una instancia mediante CONSULTA URL
router.route('/query/').get(function (req, res) {
    //Obtencion de consultas de la url
    var nombre = req.query.nombre;
    var imagen = req.query.imagen;
    var speciality = new Speciality({ nombre: nombre, imagen: imagen })
    //Guardar instancia del modelo
    speciality.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            // Redireccion a home
            res.redirect('/');
        }
    });
});

//GET THE FORMULARIO
router.route('/formulario/')
    .get( function (req, res) {
    Speciality.find().then(function (especialidades) {//viene de la BD
        res.render('formulario.html', { categorias: especialidades });
    })
}).post(function (req, res) {
    //console.log(req.body); //imprimir en consola
    // Regitro de informacion del formulario
    var nombres = req.body.nombres;
    var email = req.body.email;
    var especialidad = req.body.especialidad;
    var username = req.body.username;
    var password = req.body.password;
    // Encriptacion de contraseña
    var saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);
    // Creacion de una nueva instancia del modelo user
    var user = new User({
        nombres: nombres,
        email: email,
        especialidad: especialidad,
        username: username,
        password: hash
    });
    user.save(function (err) {
        // Aseguramiento de no errores
        if (err) {
            console.log(err);
        } else {
            // Busqueda de la especialidad elegida
            Speciality.findOne({ nombre: especialidad }).then(function (especialidad) {
                especialidad.users.push({
                    nombres: user.nombres,
                    username: user.username,
                    ref: user._id
                });
                // Aumento del numero de inscritos a la especialidad
                especialidad.inscritos++;
                // Guardar los cambios hechos en la especialidad
                especialidad.save(function (err) {
                    // Aseguramiento de no errores
                    if (err) {
                        console.log(err);
                    } else {
                        // Redireccion a home
                        res.redirect('/');
                    }
                });
            });
        }
    })
});


// Peticion post del formulario

//EXPORTACION
module.exports = router;