const miFormulario = document.querySelector('form');
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : '';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();

    const formData = {};

    for( let el of miFormulario.elements ) {
        if( el.name.length > 0 ) {
            formData[el.name] = el.value;
        }
    }       
    
    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(resp => {
        return resp.json();
      })
      .then(({ token }) => { 
        
        localStorage.setItem('token', token);
        window.location = 'chat.html';
      })
      .catch(err => { 
        console.log(err);
      })



});




async function handleCredentialResponse(response) {
    try {
      const body = { id_token: response.credential };
      const resp = await fetch(url + 'google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const { token } = await resp.json();
      localStorage.setItem('token', token);
      window.location.href = 'chat.html';
    } catch (error) {
      console.error('Error al procesar la respuesta de la promesa', error);
    }
  }

// function handleCredentialResponse(response) {
//     const body = { id_token: response.credential }
//     fetch(url + 'google', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(body)
//     })
//         .then(resp => {
//             resp.json()
            
//         })
//         .then(({ token }) => {             
//             // console.log('respuesta...',resp);
//             localStorage.setItem('token', token);
//             // localStorage.setItem('email', resp.user.email);            
//             window.location = 'chat.html';          

//         })
//         .catch(console.log);


// }
const button = document.getElementById('g_id_signout');
button.onclick = async () => {


    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        console.log('consent revoked');
        localStorage.clear()
        location.reload()
    });
}