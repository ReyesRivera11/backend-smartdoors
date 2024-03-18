import { errorHandler } from "../middleware/handleErrors.js";
import Accesos from "../models/accesos.modelo.js";

export const obtenerAccesos = async (req,res,next) => {
    const {id} = req.params
    try {
        const resultado = await Accesos.find({idUsuario: id})
        if(!resultado){
            return next(errorHandler(404,"No se encontro ningun acceso"));
        }
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};


