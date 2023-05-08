const Server = require('./models/server'); // Importamos la clase

require('dotenv').config(); // Para leer las variables de entorno

const server = new Server(); // Creamos una instancia de la clase

server.listen(); // Lanzamos el servidor

