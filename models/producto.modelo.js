import mongoose from "mongoose";

const productoSchema= new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
    },
    categoria:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorias',
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
    precio:{
        type:Number,
        required:true,
    },
    costo:{
       type:Number,
       required:true, 
    },
    existencias:{
        type:Number,
        required:true,
    },
    mac:String,
    enuso:Boolean
});

export default mongoose.model("Productos",productoSchema);