import mongoose from "mongoose";

const clienteSchema= new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
    },
    apellido:{
        type:String,
        required:true,
    },
    correo:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    pin:String,
    huella:String,
    usuariosPermitidos: [
        {type:mongoose.Schema.Types.ObjectId,ref:"UsuariosPermitidos"}
    ],
}
);

export default mongoose.model("Clientes",clienteSchema);