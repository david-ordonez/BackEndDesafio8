import fs from 'fs';
import fm from '../util/filemanager.js';

class MensajesApi {
    constructor(fileName) {
        this._fileName = fileName;
    }

    async listarAll() {
        try {
            const mensajes = await fm.readFile(this._fileName);
            return mensajes;       
        } catch (error) {
            throw error;
        }
    }

    async guardar(nuevoMensaje) {
        try {
            let newId;
            const mensajes = await fm.readFile(this._fileName);
            if(mensajes.length == 0){
                newId = 1
            } else{
                newId = mensajes[mensajes.length - 1].id + 1
            }
            mensajes.push({ ...nuevoMensaje, id: newId});            
            await fm.saveFile(this._fileName,JSON.stringify(mensajes,null,2));
        } catch (error) {
            console.log(error);
        }
    }

    async borrarTodo() {
        try {
            const data = await fs.promises.writeFile(this._fileName, '');
        } catch (error) {
            console.log(error);
        }
    }
}

export default MensajesApi;