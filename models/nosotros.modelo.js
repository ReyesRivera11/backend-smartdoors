import mongoose from "mongoose";

const NosotrosSchema = new mongoose.Schema({
    titulo:{
        type:String,
        required:true,
    },
    informacion:{
        type:String,
        required:true,
    }
});

export default mongoose.model("Nosotros",NosotrosSchema);
