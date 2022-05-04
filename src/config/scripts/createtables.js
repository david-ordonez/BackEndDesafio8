const { config } = require('../config.js');
const knexSQL = require('knex')(config.sqlite);
const knexMaria = require('knex')(config.mariaDb);

//------------------------------------------
// productos en MariaDb
(async () => {
try {
    //conexión
    
    // eliminar tabla si existe
    
    // crear tabla
   
    // destruir conexión
    await knexSQL.schema.dropTableIfExists('productos')
        .then(() => {
            return knexSQL.schema.createTableIfNotExists('productos', table => {
                table.increments('id').primary();
                table.string('nombre',50).notNullable();
                table.float('precio');
                table.string('thumbnail',254);
            });
        })
        .finally(() => {
            knexSQL.destroy();
        });

    console.log('tabla productos en mariaDb creada con éxito')
} catch (error) {
    console.log('error al crear tabla productos en mariaDb')
    console.log(error)
}

//------------------------------------------
// mensajes en SQLite3
try {
    //conexión
    
    // eliminar tabla si existe
    
    // crear tabla
   
    // destruir conexión

    await knexMaria.schema.dropTableIfExists('mensajes')
    .then(() => {
        return knexMaria.schema.createTableIfNotExists('mensajes', table => {
            table.increments('id').primary();
            table.string('author',50).notNullable();
            table.string('text',254);
            table.string('fecha',50);
        });
    })
    .finally(() => {
        knexMaria.destroy();
    });

    console.log('tabla mensajes en sqlite3 creada con éxito')
} catch (error) {
    console.log('error al crear tabla mensajes en sqlite3')
}
})()