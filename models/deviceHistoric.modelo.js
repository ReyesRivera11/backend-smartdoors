const deviceSateteSchema = new mongoose.Schema({
    mac:{
        type:String,
        required:true,
    },
    variable:{
        type:Boolean,
        required:true,
    },
    valor:{
        type:Boolean,
        required:true,
    },
    fecha:{
        type:Date,
        default:Date.now,
    }
});

export default mongoose.model("DeviceHistoric",productoSchema);