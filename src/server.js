const express = require('express');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const { config } = require('./config/config')
const ContenedorSQL = require('./contenedores/sql');



const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const productosApi = new ContenedorSQL(config.sqlite, 'productos')
const mensajesApi = new ContenedorSQL(config.mariaDb, 'mensajes')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('../public'));

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
});

server.on('error', error => console.log(`Error en servidor ${error}`));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

io.on('connection',async (socket) => {
    console.log('cliente conectado');
    const productos = await productosApi.listarAll();
    console.log(`respuesta => ${productos}`)
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