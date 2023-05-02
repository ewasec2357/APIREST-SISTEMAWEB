const Usuario = require('../models/usuario');
const fs = require('fs');
const Cliente = require('../models/clientes');

const borrarImagen = ( path ) => {
    if ( fs.existsSync( path ) ) {
        // borrar la imagen anterior
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';
    
    switch( tipo ) {
        case 'clientes':
            const cliente = await Cliente.findById(id);
            if ( !cliente ) {
                console.log('No es un cliente por id');
                return false;
            }

            pathViejo = `./uploads/clientes/${ cliente.img }`;
            borrarImagen( pathViejo );

            cliente.img = nombreArchivo;
            await cliente.sa
            ve();
            return true;
        break;       
      
        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if ( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;
    }
}

module.exports = { 
    actualizarImagen
}
