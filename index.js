require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();


// Rutas
app.use( '/api/clientes', require('./routes/clientes') );
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/especialidad', require('./routes/especialidad') );
app.use( '/api/citas', require('./routes/citas') );
app.use( '/api/canjes', require('./routes/canjes') );
app.use( '/api/ventas', require('./routes/ventas') );
app.use( '/api/productos', require('./routes/productos') );
app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/upload', require('./routes/uploads') );



app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});

