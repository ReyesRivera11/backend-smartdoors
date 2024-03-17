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
    preguntaSecreta:String,
    respuesta:String,
    usuariosPermitidos: {
        type: [{
          nombre: String,
          apellidos: String,
          pin: String,
          idHuella: String,
        }],
        default: function() {
          if (this.isNew) {
            return undefined; // No establece ningún valor si es un nuevo documento
          }
          return null; // Establece como null si no es un nuevo documento
        },
      },
      puerta: {
        type: [{
          modelo:String,
          mac:String,
          fechaCompra:{
            type:Date,
            default: Date.now
          }
        }],
        default: function() {
          if (this.isNew) {
            return undefined; // No establece ningún valor si es un nuevo documento
          }
          return null; // Establece como null si no es un nuevo documento
        },
      },
}
);

export default mongoose.model("Clientes",clienteSchema);