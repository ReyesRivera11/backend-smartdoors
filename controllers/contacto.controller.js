import { errorHandler } from "../middleware/handleErrors.js";
import Contacto from "../models/contacto.modelo.js";

export const agregar = async (req,res,next) => {
    const {nombre,correo,mensaje} = req.body;
    try {
        // console.log(nombre)
        if(!nombre) return next(errorHandler(400,"El nombre es requeridos"));
        if(!correo) return next(errorHandler(400,"La imagen es requeridos"));
        if(!mensaje) return next(errorHandler(400,"La imagen es requeridos"));
        
        const nuevoMensaje = new Contacto({nombre,correo,mensaje});
        await nuevoMensaje.save();
        res.status(200).json({msg:"Registro exitoso"});

    } catch (error) {
        next();
    }
}


export const eliminar = async (req,res,next) => {
    const {id} = req.params;
   
    try {

        const eliminarMensaje = await Contacto.findByIdAndDelete(id);

        if(!eliminarMensaje) return next(errorHandler(404,"Mensaje no encontrado"));

        return res.status(200).json({smg:"Mensaje eliminado"})
        
    } catch (error) {
        next(error);
    }
};

export const listar = async (req,res,next) => {
    try {
        const lista = await Contacto.find();
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};

