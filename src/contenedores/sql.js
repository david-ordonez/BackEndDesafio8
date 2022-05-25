import knex from 'knex';

class Sql {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async listar(id) {
        return await this.knex.from(this.tabla).select('*').where('id',id);
    }

    async listarAll() {
        return await this.knex.from(this.tabla).select('*');
    }

    async guardar(elem) {
        return await this.knex.from(this.tabla).insert(elem);
    }

    async actualizar(elem, id) {
        
    }


    async borrar(id) {
        return await this.knex.from(this.tabla).where('id',id).del();
    }

    async borrarAll() {
        return await this.knex.from(this.tabla).del();
    }

    async desconectar() {
        await this.knex.destroy();
    }
}

export default Sql;