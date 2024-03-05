import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import ClienteRouter from "./routes/cliente.routes.js"
const app = express();
dotenv.config();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL_DATABASE,{
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"Error en la conexion a mongodb"));
db.once("open",()=>console.log("Conexion exitosa a MongoDB"));

app.listen(3000,()=>console.log("Servidor conectado"));

//rutas
app.use("/api/cliente/",ClienteRouter);
app.use("/prueba",(req,res) =>res.send("Hello"));

//middleware
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
});