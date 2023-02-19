/*
    Canjes
    ruta: '/api/Canjes'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getCanjes,
    crearCanjes,
    actualizarCanjes,
    borrarCanjes
} = require('../controllers/canjes')


const router = Router();

router.get( '/', validarJWT, getCanjes );

router.post( '/',
    [
        check('cliente', 'El cliente es obligatorio').not().isEmpty(),
        check('fechadecanje', 'La fechadecanje es obligatoria').not().isEmpty(),
        check('sesiones','El número de sesiones es obligatoria').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
        check('horario', 'El horario es obligatorio').not().isEmpty(),
        validarCampos,
        validarJWT,
    ], 
    crearCanjes 
);

router.put( '/:id',
    [
        check('cliente', 'El cliente es obligatorio').not().isEmpty(),
        validarCampos,
        validarJWT,
    ],
    actualizarCanjes
);

router.delete( '/:id',
    [
        validarJWT,
    ],
    borrarCanjes
);



module.exports = router;