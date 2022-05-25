import faker from 'faker';
faker.locale = 'es';

function generarProductos() {
    return {
        nombre: faker.commerce.product(),
        precio: faker.commerce.price(),
        thumbnail: faker.image.imageUrl()
    }
}

export {  generarProductos }