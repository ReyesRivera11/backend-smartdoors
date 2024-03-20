import mongoose from "mongoose";

const preguntasSchema = new mongoose.Schema({
    pregunta:{
        type:String,
        required:true,
    },
    respuesta:{
        type:String,
        required:true,
    }
});

export default mongoose.model("Preguntas",preguntasSchema);

