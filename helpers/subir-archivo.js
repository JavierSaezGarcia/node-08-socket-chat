const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = async( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    try {
        const { archivo } = files;
    
        if (!archivo) {
          throw new Error('No se ha enviado ningún archivo');
        }
    
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
    
        if (!extensionesValidas.includes(extension)) {
          throw new Error(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
        }
    
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
    
        await archivo.mv(uploadPath);
    
        return nombreTemp;
      } catch (error) {
        throw error;
      }
    
//     return new Promise((resolve, reject) => {
       
      
//         const { archivo } = files;
//         if (!archivo) {
//             return reject('No se ha enviado ningún archivo');
//           }
        
//        const nombreCortado = archivo.name.split('.');      
        
//        const extension = nombreCortado[nombreCortado.length - 1];

        

//         // Verificar si la extension esta permitida
//         if (!extensionesValidas.includes(extension)) {
//             return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`)
            
//         }
//         // Renombrar archivo con identificador unico con el paquete uuid
//         const nombreTemp = uuidv4() + '.' + extension;
//         const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp);

//         archivo.mv(uploadPath, (err) => {
//             if (err) {
                
//                 return reject(err);
//             }

//             resolve(nombreTemp);
//         });


//    });
}

module.exports = {
    subirArchivo
};