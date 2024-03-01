'use strict'

import Publication from './publication.model.js'
import jwt from 'jsonwebtoken'
import { checkUpdate } from '../../utils/validator.js'

export const newPublication = async(req, res)=>{
    try{

     //Obtener la llave de acceso al token
     let secretKey = process.env.SECRET_KEY
     //obtener el token de los headers
     let { authorization } = req.headers
     console.log(req.headers)

     let { username } = jwt.verify(authorization, secretKey)

     const tiempo = Date.now();
    //Capturar el formulario (body)
    let data = req.body
    console.log(data)
    data.username = username
    data.date = tiempo

    //Guardar la informacion de la BD
    let publication = new Publication(data)
    await publication.save()
    //Responder al usuario
    return res.send({message: `Publicado con éxito`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error, no se pudo publicar', err: err.errors})
    }
}


export const updatePublication = async (req, res) => {
    try {
        // ID de la publicacion a actualizar
        let { id } = req.params;
        // Obtener los datos a actualizar
                //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //obtener el token de los headers
        let { authorization } = req.headers
        //Obtener el uid del usuario que envió el token
        let { username } = jwt.verify(authorization, secretKey)
        const publicacion = await Publication.findById(id);
                                    // if para verificar que el id es el mismo que el del token y que deje actualizar
        if(publicacion.username == username){
        // simon
        let data = req.body;
        // Validar si los datos traen información
        let update = checkUpdate(data, id);
        if (!update) return res.status(400).send({ message: 'Se han enviado datos que no se pueden actualizar o faltan datos' });

        // Validar permisos (tokenización) *hoy no se ve*

        // Actualizar en la base de datos
        let updatePublication = await Publication.findOneAndUpdate(
            { _id: id }, // ObjectID <- hexadecimal (Hora del sistema, versión de MongoDB, Clave privada)
            data, // Datos que se van a actualizar
            { new: true } // Objeto de la BD ya actualizado
        );

        // Validar la actualización
        if (!updatePublication) return res.status(401).send({ message: 'No actualizado' });
       
        // Responder al usuario
        return res.send({ message: 'Actualización exitosa', updatePublication });
    } else {
        return res.status(400).send({ message: 'No se pudo actualizar ya que no es tu publicacion.' })
    }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error actualizando la publicacion' });
    }
};


export const deletePublication = async(req, res)=>{
    try{
        // ID de la publicacion a actualizar
        let { id } = req.params;
        // Obtener los datos a actualizar
                //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //obtener el token de los headers
        let { authorization } = req.headers
        //Obtener el uid del usuario que envió el token
        let { username } = jwt.verify(authorization, secretKey)
        const publicacion = await Publication.findById(id);
                                    // if para verificar que el id es el mismo que el del token y que deje actualizar
        if(publicacion.username == username){
        // Eliminar (deleteOne / findOneAndDelete)
        let deletedPublication = await Publication.findOneAndDelete({_id: id})
        // Verificar que se elimino
        if(!deletedPublication) return res.status(404).send({message: 'La publicacion no fue encontrada'})
        // Responder
        return res.send({message: `La publicacion ${deletedPublication.title} fue borrada exitosamente`})
    } else {
        return res.status(400).send({ message: 'No se pudo borrar ya que no es tu publicacion.' })
    }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting acount'})
    }
}