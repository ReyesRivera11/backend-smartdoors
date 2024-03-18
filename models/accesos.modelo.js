import mongoose from "mongoose";

const ingresoSchema = new mongoose.Schema({
    nombre:String,
    apellido:String,
    fecha:String,
    idUsuario:mongoose.Schema.Types.ObjectId
});

export default mongoose.model("Accesos",ingresoSchema);