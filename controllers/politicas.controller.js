import { errorHandler } from "../middleware/handleErrors.js";
import Politicas from "../models/politicas.modelo.js";

export const agregar = async (req, res, next) => {
    const { titulo, politica } = req.body;
    try {
        if (!titulo) return next(errorHandler(400, "El titulo es requerido"));
        if (!politica) return next(errorHandler(400, "La politica es requerida"));
        
        const nuevaPolitica = new Politicas({ titulo, politica });
        await nuevaPolitica.save();
        
        res.status(200).json({ msg: "Politica registrada correctamente" });
    } catch (error) {
        next(error);
    }
};

export const editar = async (req, res, next) => {
    const { id } = req.params;
    try {
        const politicaActualizada = await Politicas.findByIdAndUpdate(id, req.body);
        if (!politicaActualizada) return next(errorHandler(404, "Politica no encontrada"));

        res.status(200).json({ msg: "Politica actualizada correctamente" });
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    const { id } = req.params;
    try {
        const eliminarPolitica = await Politicas.findByIdAndDelete(id);
        if (!eliminarPolitica) return next(errorHandler(404, "Politica no encontrada"));

        res.status(200).json({ msg: "Politica eliminada correctamente" });
    } catch (error) {
        next(error);
    }
};

export const listar = async (req, res, next) => {
    try {
        const lista = await Politicas.find();
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};
export const obtenerById = async (req, res, next) => {
    const {id} = req.params;
    try {
        const lista = await Politicas.findById(id);
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};
