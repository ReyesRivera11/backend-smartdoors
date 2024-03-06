import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import ClienteRouter from "./routes/cliente.routes.js"
import bodyParser from "body-parser";
import axios from 'axios';
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL_DATABASE, {
    useNewUrlParser: true,
});

app.get("ledController", (req,res) =>{
    const {valor} = req.body;
    res.send(`${valor}`);
});

app.get('/encender', (req, res) => {
    // Lógica para encender el LED
    console.log('Encendiendo el LED');
    // Puedes ejecutar aquí cualquier código adicional que necesites
  
    res.send('LED encendido');
  });
  
  app.get('/apagar', (req, res) => {
    // Lógica para apagar el LED
    console.log('Apagando el LED');
    // Puedes ejecutar aquí cualquier código adicional que necesites
  
    res.send('LED apagado');
  });



const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error en la conexion a mongodb"));
db.once("open", () => console.log("Conexion exitosa a MongoDB"));

app.listen(3000, () => console.log("Servidor conectado"));

//rutas
app.use("/api/cliente/", ClienteRouter);







//middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
});