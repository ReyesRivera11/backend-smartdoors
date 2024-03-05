import mongoose from "mongoose";
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    pin: String,
    idHuella: String
});

export default mongoose.model("UsuariosPermitidos",usuarioSchema);