import express from 'express';
import { Server as IOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import normalizr from 'normalizr';
import util from 'util';
import config from './config/config.js';
import ContenedorSQL from './contenedores/sql.js';
import ProductosRouter  from './router/productos.js';
import MensajesApi from './contenedores/mensajes.js';

const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const normalize = normalizr.normalize;
const schema = normalizr.schema;

const productosApi = new ContenedorSQL(config.sqlite, 'productos')
const mensajesApi = new MensajesApi('./DB/mensajes.json')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('../public'));
app.use('/api/productos-test', new ProductosRouter());


/*-----------------NORMALIZACION DE OBJETOS------------------*/

const authorSchema = new schema.Entity('author', { }, { idAttribute:'email' });
const mensajeSchema = new schema.Entity('post', { 
  author: authorSchema 
}, { idAttribute: 'id' });

const postsSchema = new schema.Entity('posts',{
    mensajes: [mensajeSchema]
}, { idAttribute: 'id' });



/*-------------------------------------------------------------*/

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
});

server.on('error', error => console.log(`Error en servidor ${error}`));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/productos-test',(req,res) => {
    res.sendFile('productos-test.html', { root: __dirname });
});

io.on('connection',async (socket) => {
    console.log('cliente conectado');
    const productos = await productosApi.listarAll();
    socket.emit('listaProductos',productos);

    socket.on('nuevoProducto',async nuevoProducto => {
        await productosApi.guardar(nuevoProducto);
        io.sockets.emit('listaProductos', productosApi.listarAll());
    });

    socket.emit('listaMensajes',mensajesApi.listarAll());
    socket.on('nuevoMensaje', async nuevoMensaje => {
        await mensajesApi.guardar(nuevoMensaje);

        const listaMensajes = await mensajesApi.listarAll();  
        const normalizedData = listaMensajes.length !== 0 ? normalize({id:'mensajes', mensajes: listaMensajes }, postsSchema) : {};
        const porcentaje = calculaPorcentaje(listaMensajes, normalizedData) 

        io.sockets.emit('listaMensajes',{ normalizedData, porcentaje } );
    });
});

function calculaPorcentaje(originalData, normalizedData){
    if(originalData.length == 0 || Object.keys(normalizedData).length === 0) return 0;

    const tamanio = JSON.stringify(originalData).length;
    const tamanioNormalized = JSON.stringify(normalizedData).length;
    const porc = (tamanioNormalized * 100) / tamanio;

    return porc.toFixed(2);
}
