import mongoose from "mongoose";

const deviceHistoricSchema = new mongoose.Schema({
    mac:{
        type:String,
        required:true,
    },
    variable:String,
    valor:{
        type:Boolean,
        required:true,
    },
    fecha:String
});

export default mongoose.model("DeviceHistoric",deviceHistoricSchema);