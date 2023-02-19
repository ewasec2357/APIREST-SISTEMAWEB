/*
    Canjes
    ruta: '/api/Canjes'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getProductos,
    crearProductos,
    actualizarProductos,
    borrarProductos
} = require('../controllers/productos')


const router = Router();

router.get( '/', validarJWT, getProductos );

router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('serie', 'El número de serie es obligatoria').not().isEmpty(),
        check('precio','El precio es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
        check('fechacreacion', 'La fecha de creación es obligatoria').not().isEmpty(),
        validarCampos,
        validarJWT,
    ], 
    crearProductos 
);

router.put( '/:id',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('serie', 'El número de serie es obligatoria').not().isEmpty(),
        validarCampos,
        validarJWT,
    ],
    actualizarProductos
);

router.delete( '/:id',
    [
        validarJWT,
    ],
    borrarProductos
);



module.exports = router;