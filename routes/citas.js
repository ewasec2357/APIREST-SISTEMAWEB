/*
    Citas
    ruta: '/api/citas'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getCitas,
    crearCitas,
    actualizarCita,
    borrarCita
} = require('../controllers/citas')


const router = Router();

router.get( '/', validarJWT, getCitas );

router.post( '/',
    [
        check('cliente', 'El cliente es obligatorio').not().isEmpty(),
        check('especialidad', 'La especialidad es obligatoria').not().isEmpty(),
        check('doctor', 'El doctor es obligatorio').not().isEmpty(),
        check('horario', 'El horario es obligatorio').not().isEmpty(),
        validarCampos,
        validarJWT,
    ], 
    crearCitas 
);

router.put( '/:id',
    [
        check('cliente', 'El cliente es obligatorio').not().isEmpty(),
        validarCampos,
        validarJWT,
    ],
    actualizarCita
);

router.delete( '/:id',
    validarJWT,
    borrarCita
);


module.exports = router;