import express from 'express';
import { Server as IOServer } from 'socket.io';
import { Server as HttpServer } from 'http'
import config from './config/config.js';
import ContenedorSQL from './contenedores/sql.js';
import ProductosRouter  from './router/productos.js';
import MensajesApi from './contenedores/mensajes.js';



const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const productosApi = new ContenedorSQL(config.sqlite, 'productos')
const mensajesApi = new MensajesApi('./DB/mensajes.json')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('../public'));
app.use('/api/productos-test', new ProductosRouter());

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
        io.sockets.emit('listaMensajes', await mensajesApi.listarAll());
    });
});