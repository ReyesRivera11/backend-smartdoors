import mongoose from "mongoose";

const empleadosSchema= new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
    },
    apellidos:{
        type:String,
        required:true,
    },
    numeroTelefono:{
        type:String,
        required:true,
    },
    correo:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    direccion:{
       ciudad:{
        type:String,
        required:true,
       },
       calle:{
        type:String,
        required:true,
       },
       colonia:{
        type:String,
        required:true,
       }
    },
    role:{
        type:String,
        required:true,
    }
});

export default mongoose.model("empleados",empleadosSchema);