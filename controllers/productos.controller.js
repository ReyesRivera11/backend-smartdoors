import { errorHandler } from "../middleware/handleErrors.js";
import Productos from "../models/producto.modelo.js"
import express from "express";
import mongoose from "mongoose";

export const agregar = async (req,res,next) => {
    
    const {nombre,categoria,imagen,descripcion,precio,costo,existencias,mac} = req.body;
    try {
        const productoNuevo = new Productos({
            nombre,
            categoria,
            imagen,
            descripcion,
            precio,
            costo,
            existencias,
        });
        await productoNuevo.save();
        res.status(200).json({msg:"Producto registrado correctamente"});

    } catch (error) {
        console.log(error)
        next();
    }
}

export const obtenerProductos = async (req, res, next) => {
    try {
        const productos = await Productos.find()
            .populate({
                path: 'categoria',
                select: 'nombre',
            })
            .exec();

        
        const resultados = productos.map(producto => ({
           
            _id: producto._id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            costo:producto.costo,
            existencias: producto.existencias,
            imagen: producto.imagen,
            // ... otros campos del producto,
            categoria: producto.categoria.nombre,  // Accede directamente al campo 'nombre'
        }));

        res.status(200).json(resultados );
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const obtenerProducto = async (req,res,next) =>{
    const {id} = req.params;
    try {
        const getProducto = await Productos.findById(id);
        if(!getProducto)return next(errorHandler(401,"El producto no existe"));
        return res.status(200).json(getProducto);
    } catch (error) {
        next(error);
    }
}

export const editarProducto = async (req,res,next) => {
    const {id} = req.params;
    const data = req.body;
    try {
         const buscarProducto = await Productos.findByIdAndUpdate(id,data);
         if(!buscarProducto)return next(errorHandler(401,"El producto no existe."));
        return res.status(200).json({messagge:"Producto actualizado"});
    } catch (error) {
        
    }
}

export const obtenerProductosCate = async (req,res,next) => {
    const {categoria} = req.params;
    try {
        const resultado = await Productos.find({categoria})
        if(!resultado)return next(errorHandler(401,"La categoria no existe"));
        return res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

