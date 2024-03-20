import { errorHandler } from "../middleware/handleErrors.js";
import Nosotros from "../models/nosotros.modelo.js";

export const agregar = async (req, res, next) => {
    const { titulo, informacion } = req.body;
    try {
        if (!titulo) return next(errorHandler(400, "El título es requerido"));
        if (!informacion) return next(errorHandler(400, "La información es requerida"));
        
        const nuevaInformacion = new Nosotros({ titulo, informacion });
        await nuevaInformacion.save();
        
        res.status(200).json({ msg: "Información registrada correctamente" });
    } catch (error) {
        next(error);
    }
};

export const editar = async (req, res, next) => {
    const { id } = req.params;
    try {
        const informacionActualizada = await Nosotros.findByIdAndUpdate(id, req.body);
        if (!informacionActualizada) return next(errorHandler(404, "Información no encontrada"));

        res.status(200).json({ msg: "Información actualizada correctamente" });
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    const { id } = req.params;
    try {
        const eliminarInformacion = await Nosotros.findByIdAndDelete(id);
        if (!eliminarInformacion) return next(errorHandler(404, "Información no encontrada"));

        res.status(200).json({ msg: "Información eliminada correctamente" });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    const {id} = req.params;
    try {
        const lista = await Nosotros.findById(id);
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};


export const listar = async (req, res, next) => {
    try {
        const lista = await Nosotros.find();
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};
