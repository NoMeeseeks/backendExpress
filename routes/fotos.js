var express = require('express');
var router = express.Router();
module.exports = router;
const {Sequelize, Op} = require('sequelize');
const Foto = require('../models').foto;
const Etiqueta = require('../models').etiqueta;
const axios = require('axios');

router.get('/findAll', function (req, res, next) {
    Foto.findAll({
        attributes: {exclude: ["updatedAt"]},
        include: [{
            model: Etiqueta,
            attributes: ['texto'],
            through: {attributes: []}
        }],
    })
        .then(fotos => {
            res.render('index', {
                title: 'Fotos',
                view: 'pages/fotos',
                arrFotos: fotos
            });
        })
        .catch(error => res.status(400).send(error));
});

router.get('/calificacion', function (req, res, next) {
    let lower = parseFloat(req.query.lower);
    let higher = parseFloat(req.query.higher);
    if (isNaN(lower) && isNaN(higher)) {
        lower = -1
        higher = 5
    }
    console.log(lower)
    console.log(higher)

    Foto.findAll({
        attributes: {exclude: ["updatedAt"]},
        include: [{
            model: Etiqueta,
            attributes: ['texto'],
            through: {attributes: []}
        }],
        where: {
            calificacion: {
                [Op.between]: [lower, higher]
            }
        }
    })
        .then(fotos => {
            res.render('index', {
                title: 'Calificación',
                view: 'pages/calificacion',
                arrFotos: fotos
            });
        })
        .catch(error => res.status(400).send(error));
});

router.get('/crearFoto', function (req, res, next) {
    res.render('index', {
        title: 'Crea tu foto',
        view: 'pages/foto',
    });
});

router.get('/actualizarFoto', function (req, res, next) {
    res.render('index', {
        title: 'Actualiza tu foto',
        view: 'pages/foto',
    });
});


router.get('/findAll/json',
    function (req, res, next) {
        Foto.findAll({
            attributes: {exclude: ["updatedAt"]},
            include: [{
                model: Etiqueta,
                attributes: ['texto'],
                through: {attributes: []}
            }],

        })
            .then(fotos => {
                res.json(fotos);
            })
            .catch(error =>
                res.status(400).send(error))
    });

router.get('/findAllByRate/json', function (req, res, next) {
    let lower = parseFloat(req.query.lower);
    let higher = parseFloat(req.query.higher);
    Foto.findAll({
        attributes: {exclude: ["updatedAt"]},
        include: [{
            model: Etiqueta,
            attributes: ['texto'],
            through: {attributes: []}
        }],
        where: {
            calificacion: {
                [Op.between]: [lower, higher]
            }
        }
    })
        .then(fotos => {
            res.render('pages/calificacion', {title: 'loveAndPeace', arrFotos: fotos});
        })
        .catch(error =>
            res.status(400).send(error))
});

router.post('/guardar', async (req, res) => {
    try {
        const {id, titulo, descripcion, ruta, fecha_creacion, calificacion, etiquetaId} = req.body;

        if (!titulo || !descripcion || !ruta || !fecha_creacion || !calificacion || !etiquetaId) {
            return res.status(400).json({error: "Faltan datos requeridos"});
        }

        let foto;
        if (id) {
            // Si hay ID, actualizar la foto existente
            foto = await Foto.findByPk(id);
            if (!foto) {
                return res.status(404).json({error: "Foto no encontrada"});
            }
            await foto.update({titulo, descripcion, ruta, fecha_creacion, calificacion, etiquetaId});
        } else {
            // Si no hay ID, crear una nueva foto
            foto = await Foto.create({titulo, descripcion, ruta, fecha_creacion, calificacion, etiquetaId});
        }

        res.redirect('/fotos/findAll'); // Redirige a la lista de fotos
    } catch (error) {
        res.status(500).json({error: "Error al guardar la foto", detalle: error.message});
    }
});

router.post('/guardarDos', async (req, res) => {
    try {
        let {titulo, descripcion, calificacion} = req.body
        const URL = 'http://localhost:4444/rest/save'
        let data = {
            titulo: titulo,
            descripcion: descripcion,
            calificacion: calificacion,
            ruta: "/default/prueba"
        }
        const config = {
            proxy: {
                host: 'localhost',
                port: 4444
            }
        }
        const response = await axios.post(URL, data, config)

        if (response.status === '200' && response.statusText === 'OK') {
            res.redirect('/fotos/findAll'); // Redirige a la lista de fotos
        }
    } catch (error) {
        res.status(500).json({error: "Error al guardar la foto", detalle: error.message});
    }
});

router.post('/photos/save', async function (req, res, next) {
    let {title, description, rate} = req.body
    const URL = 'http://localhost:4444/rest/fotos/save'

    let data = {
        titulo: title,
        descripcion: description,
        calificacion: rate,
        ruta: ''
    }
    const config = {
        proxy: {
            host: 'localhost',
            port: 4444
        }
    }

    const response = await axios.post(URL, data, config);

    if (response.status == '200' && response.statusText == 'OK') {
        res.redirect('/fotos/findAll'); // Redirige a la lista de fotos
    } else {
        res.redirect('/')
    }
});


router.put('/actualizarFoto/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {titulo, descripcion, ruta, fecha_creacion, etiquetaId} = req.body;

        const foto = await Foto.findByPk(id);
        if (!foto) {
            return res.status(404).json({error: "Foto no encontrada"});
        }

        await foto.update({
            titulo: titulo || foto.titulo,
            descripcion: descripcion || foto.descripcion,
            ruta: ruta || foto.ruta,
            fecha_creacion: fecha_creacion || foto.fecha_creacion,
            etiquetaId: etiquetaId || foto.etiquetaId
        });

        res.json({mensaje: "Foto actualizada con éxito", foto});
    } catch (error) {
        res.status(500).json({error: "Error al actualizar la foto", detalle: error.message});
    }
});