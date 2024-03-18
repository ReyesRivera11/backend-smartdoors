import mongoose from "mongoose";

const deviceSateteSchema = new mongoose.Schema({
    mac:{
        type:String,
        required:true,
    },
    presencia:{
        type:Boolean,
        required:true,
    },
    estado:{
        type:Boolean,
        required:true,
    },
});

export default mongoose.model("DeviceState",deviceSateteSchema);