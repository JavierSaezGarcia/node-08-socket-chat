
let user = null;
let socket = null;


const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

const validarJWT = async() => {
    console.log('prueba')
    const token = localStorage.getItem('token');
     
    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el localstorage');
    }

    const resp = await fetch('http://localhost:8080/api/auth', {
        headers: {
            'x-token': token
        }
    });

    const { user: userDB, token: tokenDB } = await resp.json();      
    localStorage.setItem('token', tokenDB);    
    user = userDB;    
    document.title = user.name;
    
    await conectarSocket();

   
}

const conectarSocket = async() => {
    socket = io({
        extraHeaders: {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log(`${user.name} conectado`);
    });

    socket.on('disconnect', () => {
        console.log(`${user.name} desconectado`);
    });


    // TODO interaccion con el chat
    socket.on('recibir-mensajes', dibujarMensajes);
    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', dato => { 
        console.log('Privado',dato);
    });

    
}

const dibujarUsuarios = (users = []) => {

    let usersHtml = '';
    users.forEach(({ name, uid }) => {
         usersHtml += `
        <li>
            <p>
                <h5 class="text-success">${name}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
}

// const time = () => {
//     let date = new Date();

//     let hora = date.getHours();
//     let min = date.getMinutes();
//     let seg = date.getSeconds();
//     return `${hora}:${min}:${seg}`;
// }

const dibujarMensajes = (mensajes = []) => {
     
    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
        
        mensajesHTML += `
        <li>
            <p>
               <strong> <span class="text-primary">${ nombre.toUpperCase() }: </span>
                <span>${  mensaje }</span></strong>
            </p>
        </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;


    
}


txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;
    console.log(mensaje, uid)

    if (keyCode !== 13) return;

    if (mensaje.length === 0) return;

    socket.emit('enviar-mensaje', { mensaje, uid  });

    txtMensaje.value = '';
});


const main = async() => {
    // Validar JWT
    await validarJWT();
}
main();

// const socket = io();