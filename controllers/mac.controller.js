import {errorHandler} from "../middleware/handleErrors.js";
import Mac from "../models/mac.modelo.js"
export const agregar = async(req,res,next) => {
    const {mac} = req.body;
    try {
        const buscarMac = await Mac.findOne({mac});
        if(buscarMac) return next(errorHandler(400,"La mac ya esta registrada."));
        const nuevaMac = new Mac({mac});
        await nuevaMac.save();
        res.status(200).json({msg:"Categoria registrada correctamente"});
    } catch (error) {
        next(error)
    }
}

export const obtenerMacs = async(req,res,next) => {
    try {
        const buscarMac = await Mac.find();
        if(!buscarMac) return next(errorHandler(404,"No se encontro ninguna mac"));
        res.status(200).json(buscarMac);
    } catch (error) {
        next(error)
    }
}
export const editar = async(req,res,next) => {
    const {id} = req.params;
    const data = req.body;
    try {
        const buscarMac = await Mac.findByIdAndUpdate(id, data);
        if(!buscarMac) return next(errorHandler(404,"No se encontro ninguna mac"));
        res.status(200).json({msg:"Actualizado correctamente"});
    } catch (error) {
        next(error)
    }
}
