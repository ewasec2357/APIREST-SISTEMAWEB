/*
    Ruta: /api/clientes
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getClientes, crearCliente, actualizarCliente, borrarCliente } = require('../controllers/clientes');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get( '/', validarJWT , getClientes );

router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellido', 'El apellido es obligatorio').not().isEmpty(),
        check('genero', 'El genero es obligatorio').not().isEmpty(),
        check('dni', 'El dni es obligatorio').not().isEmpty(),
        check('nacimiento', 'El cumpleaños es obligatorio').not().isEmpty(),
        check('celular', 'El celular es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es requerido y debe tener 8 caracteres como mínimo').isLength({ min: 8 }).not().isEmpty(),    
        validarCampos,
    ], 
    crearCliente 
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    actualizarCliente
);

router.delete( '/:id',
    validarJWT,
    borrarCliente
);



module.exports = router;