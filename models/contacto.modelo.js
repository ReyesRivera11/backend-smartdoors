import mongoose from "mongoose";

const contactoSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
    },
    correo:{
        type:String,
        required:true,
    },
    mensaje:{
        type:String,
        required:true,
    }
});

export default mongoose.model("Contacto",contactoSchema);