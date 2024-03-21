import { errorHandler } from "../middleware/handleErrors.js";
import PreguntasRespuestas from "../models/preguntas.modelo.js";

export const agregar = async (req, res, next) => {
    const { pregunta, respuesta } = req.body;
    try {
        if (!pregunta) return next(errorHandler(400, "La pregunta es requerida"));
        if (!respuesta) return next(errorHandler(400, "La respuesta es requerida"));
        
        const nuevaPreguntaRespuesta = new PreguntasRespuestas({ pregunta, respuesta });
        await nuevaPreguntaRespuesta.save();
        
        res.status(200).json({ msg: "Pregunta y respuesta registradas correctamente" });
    } catch (error) {
        next(error);
    }
};

export const editar = async (req, res, next) => {
    const { id } = req.params;
    try {
        const actualizarPreguntaRespuesta = await PreguntasRespuestas.findByIdAndUpdate(id, req.body);
        if (!actualizarPreguntaRespuesta) return next(errorHandler(404, "Pregunta y respuesta no encontradas"));

        res.status(200).json({ msg: "Pregunta y respuesta actualizadas correctamente" });
    } catch (error) {
        next(error);
    }
};

export const eliminar = async (req, res, next) => {
    const { id } = req.params;
    try {
        const eliminarPreguntaRespuesta = await PreguntasRespuestas.findByIdAndDelete(id);
        if (!eliminarPreguntaRespuesta) return next(errorHandler(404, "Pregunta y respuesta no encontradas"));

        res.status(200).json({ msg: "Pregunta y respuesta eliminadas correctamente" });
    } catch (error) {
        next(error);
    }
};

export const listar = async (req, res, next) => {
    try {
        const lista = await PreguntasRespuestas.find();
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};

export const getPregunta = async (req, res, next) => {
    const {id} = req.params;
    try {
        const lista = await PreguntasRespuestas.findById(id);
        return res.status(200).json(lista);
    } catch (error) {
        next(error);
    }
};

