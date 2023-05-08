const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.js');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            users:      '/api/users'
        }
       

        // Conectar a base de datos
        this.conectarDB();

        // TODO middelwares
        this.middlewares();

        // TODO rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {        
        await dbConnection();
    }
    middlewares() { 
        // uso de cors para restringir las peticiones
        this.app.use( cors() );

        // Lectura y parseo del body del request
        this.app.use( express.json() );
        
        // directorio publico
        this.app.use(express.static('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }
    // Rutas o endpoints
    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.js')); // 2.- definiendo el path para esta ruta que va a routes/auth.js
        this.app.use(this.paths.buscar, require('../routes/buscar.js'));     
        this.app.use(this.paths.users, require('../routes/users.js'));
        this.app.use(this.paths.categorias, require('../routes/categorias.js'));       
        this.app.use(this.paths.productos, require('../routes/productos.js'));       
        this.app.use(this.paths.uploads, require('../routes/uploads.js'));       
          
    }

    
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }

}

module.exports = Server;
