import ProductosApi from "../contenedores/productos.js";
import { generarProductos } from "../util/generadorProductos.js";

class ApiProductosMock extends ProductosApi {
    constructor() {
        super()
    }

    popular(cant = 5) {
        const nuevos = [];
        for (let i = 1; i<= cant; i++) {
            const nuevoUsuario = generarProductos();
            const guardado = this.guardar(nuevoUsuario);
            nuevos.push(guardado)
        }
        return nuevos;
    }
}

export default ApiProductosMock;