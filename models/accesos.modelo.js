import mongoose from "mongoose";

const ingresoSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clientes'
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    usuariosIngresados: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UsuariosPermitidos',
        }
    ],
});

export default mongoose.model("Accesos",ingresoSchema);