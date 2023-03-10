/*
    Especialidades
    ruta: '/api/especialidades'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getEspecialidad,
    crearEspecialidad,
    actualizarEspecialidad,
    borrarEspecialidad
} = require('../controllers/especialidad')


const router = Router();

router.get( '/', validarJWT, getEspecialidad );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre de la especialidad es necesario').not().isEmpty(),
        validarCampos
    ], 
    crearEspecialidad 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre de la especialidad es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarEspecialidad
);

router.delete( '/:id',
    [
        validarJWT
    ],
    borrarEspecialidad
);



module.exports = router;
