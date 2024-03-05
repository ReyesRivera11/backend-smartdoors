import mongoose from "mongoose";

const productoSchema= new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
    },
    tipo:{
        type:String,
        required:true,
    },
    mac:{
        type:String,
        required:true,
    },
    imagen:{
        type:String,
        required:true,
    },
    descripcion:{
        type:String,
        required:true,
    },
});

export default mongoose.model("productos",productoSchema);