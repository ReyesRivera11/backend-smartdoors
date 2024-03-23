import mongoose from "mongoose";

const macSchema = new mongoose.Schema({
    mac:{
        type:String,
        required:true,
        unique:true,
    },
    enuso:{
        type:Boolean,
        default:false,
    },
    puerta:{
        type:String,
        required:true,
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clientes',
    },
    codigo:{
        type:String,
        required:true,
        unique:true
    }
});

export default mongoose.model("PuertasIot",macSchema);