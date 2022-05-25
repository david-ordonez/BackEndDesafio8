import express from 'express';
import ApiProductosMock from '../api/productosMock.js';

class ProductosRouter extends express.Router {
    constructor() {
        super();

        const apiProductos = new ApiProductosMock();
        
        this.get('/api/productos-test', async (req, res, next) => {
            try {
                await apiProductos.popular();
                res.json(await apiProductos.listarAll());
            } catch (error) {
                next(error);
            }
        })


    }
}

export default ProductosRouter;