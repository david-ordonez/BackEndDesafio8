const socket = io.connect();

const formAgregarProducto = document.getElementById('frmProductos')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault();
    const nuevoProducto = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    socket.emit('nuevoProducto', nuevoProducto);
    return false;
})

socket.on('listaProductos', async listaProductos => {
    const html = await renderListaProductos(listaProductos);
    document.getElementById('listaProductos').innerHTML = html;
});

async function renderListaProductos(productos) {
    return fetch('templates/listaProductos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const productosExists = productos.length > 0;
            const template = Handlebars.compile(plantilla);
            const html = template({ productos, productosExists })
            return html
        });
}

//*********************************************************************/

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const authorSchema = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
const mensajeSchema = new normalizr.schema.Entity('post', {
    author: authorSchema
}, { idAttribute: 'id' });

const postsSchema = new normalizr.schema.Entity('posts', {
    mensajes: [mensajeSchema]
}, { idAttribute: 'id' });

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault();
    const fecha = new Date();
    const nuevoMensaje = {
        author: {
            email: inputUsername.value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: inputMensaje.value,
        fecha: `${fecha.toLocaleDateString('es-MX')} ${fecha.toLocaleTimeString('es-MX')}`
    };
    socket.emit('nuevoMensaje', nuevoMensaje);
    formPublicarMensaje.reset();
    inputMensaje.focus();
    return false;
})

inputUsername.addEventListener('change', e => {
    inputMensaje.disabled = !inputUsername.checkValidity();
    btnEnviar.disabled = !inputUsername.checkValidity();
});

socket.on('listaMensajes', async listaMensajes => {
    console.log(`objeto mensajes => ${JSON.stringify(listaMensajes)}`);
    document.getElementById('compresion-info').innerText = `${listaMensajes.porcentaje} %`;
    const denormalizedData = normalizr.denormalize(listaMensajes.normalizedData?.result, postsSchema, listaMensajes.normalizedData?.entities);
    const html = await renderListaMensajes(denormalizedData.mensajess);
    document.getElementById('listaMensajes').innerHTML = html;
});

async function renderListaMensajes(mensajes) {
    console.log(mensajes);
    return fetch('templates/listaMensajes.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ mensajes })
            return html
        });
}
