
import { errorHandler } from "../middleware/handleErrors.js";

import Categorias from "../models/categoria.modelo.js";

export const agregar = async (req,res,next) => {
    // res.send("hola");
    const {nombre,imagen} = req.body;
    try {
        // console.log(nombre)
        if(!nombre) return next(errorHandler(400,"El nombre es requeridos"));
        if(!imagen) return next(errorHandler(400,"La imagen es requeridos"));
        
        const nuevacategoria = new Categorias({nombre,imagen});
        await nuevacategoria.save();
        res.status(200).json({msg:"Categoria registrada correctamente"});

    } catch (error) {
        next();
    }
}

export const editar = async (req,res,next) => {
    const {id} = req.params;
   
    console.log(req.body);
    try {

        const actualizarCategoria = await Categorias.findByIdAndUpdate(id,req.body);

        if(!actualizarCategoria) return next(errorHandler(404,"Producto no encontrado"));

        return res.status(200).json({smg:"Producto actualizado"})
        
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req,res,next) => {
    const {id} = req.params;
   
    try {

        const eliminarCategoria = await Categorias.findByIdAndDelete(id);

        if(!eliminarCategoria) return next(errorHandler(404,"Producto no encontrado"));

        return res.status(200).json({smg:"Producto eliminado"})
        
    } catch (error) {
        next(error);
    }
};

export const listar = async (req,res,next) => {
    try {
        const lista = await Categorias.find();
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};

export const burcarPorId = async (req,res,next) => {
    const {id} = req.params;
    try {
        const lista = await Categorias.findById(id);
        if(!lista) return next(errorHandler(404,"Categoria no encontrada"));
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};