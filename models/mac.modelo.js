import mongoose from "mongoose";

const macSchema = new mongoose.Schema({
    mac:{
        type:String,
        required:true,
    },
    enuso:{
        type:Boolean,
        default:false,
    }
});

export default mongoose.model("Mac",macSchema);