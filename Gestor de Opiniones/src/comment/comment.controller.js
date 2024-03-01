'use strict'

import Comment from './comment.model.js'
import jwt from 'jsonwebtoken'
import { checkUpdate } from '../../utils/validator.js'

export const newComment = async(req, res)=>{
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
    let comment = new Comment(data)
    await comment.save()
    //Responder al usuario
    return res.send({message: `Publicado con éxito`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error, no se pudo publicar', err: err.errors})
    }
}


export const updateComment = async (req, res) => {
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
        const comment = await Comment.findById(id);
                                    // if para verificar que el id es el mismo que el del token y que deje actualizar
        if(comment.username == username){
        // simon
        let data = req.body;
        // Validar si los datos traen información
        let update = checkUpdate(data, id);
        if (!update) return res.status(400).send({ message: 'Se han enviado datos que no se pueden actualizar o faltan datos' });

        // Validar permisos (tokenización) *hoy no se ve*

        // Actualizar en la base de datos
        let updateComment = await Comment.findOneAndUpdate(
            { _id: id }, // ObjectID <- hexadecimal (Hora del sistema, versión de MongoDB, Clave privada)
            data, // Datos que se van a actualizar
            { new: true } // Objeto de la BD ya actualizado
        );

        // Validar la actualización
        if (!updateComment) return res.status(401).send({ message: 'No actualizado' });
       
        // Responder al usuario
        return res.send({ message: 'Actualización exitosa', updateComment });
    } else {
        return res.status(400).send({ message: 'No se pudo actualizar ya que no es tu comentario.' })
    }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error actualizando el comentario' });
    }
}


export const deleteComment = async(req, res)=>{
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
        const comment = await Comment.findById(id);
                                    // if para verificar que el id es el mismo que el del token y que deje actualizar
        if(comment.username == username){
        // Eliminar (deleteOne / findOneAndDelete)
        let deletedComment = await Comment.findOneAndDelete({_id: id})
        // Verificar que se elimino
        if(!deletedComment) return res.status(404).send({message: 'El comentario no fue encontrado'})
        // Responder
        return res.send({message: `El comentario del usuario  ${deletedComment.username} fue borrado exitosamente`})
    } else {
        return res.status(400).send({ message: 'No se pudo borrar ya que no es tu comentario.' })
    }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error al borrar comentario'})
    }
}


/*export const seeCommentsForPublication = async(req, res)=>{
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Buscar
        let comments = await Comment.find(
            {publication: search}
        ).populate('publication', ['title'])
        //Validar la respuesta
        if(!comments) return res.status(404).send({message: 'product not found'})
        //Responder si todo sale bien
        return res.send({message: 'product found', comments})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching product'})
    }
}*/