import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
    },
    imagen:{
        type:String,
        required:true,
    }
});

export default mongoose.model("Categorias",categoriaSchema);