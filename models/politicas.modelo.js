import mongoose from "mongoose";

const politicasSchema = new mongoose.Schema({
    titulo:{
        type:String,
        required:true,
    },
    politica:{
        type:String,
        required:true,
    }
});

export default mongoose.model("Politicas",politicasSchema);
