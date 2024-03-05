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

const ledStatus = { status: 0 };
app.post('/controlarLed', (req, res) => {
    const nuevoEstado = req.body.status;
  
    if (nuevoEstado !== undefined && (nuevoEstado === 0 || nuevoEstado === 1)) {
      ledStatus.status = nuevoEstado;
      res.send(String(nuevoEstado));
    } else {
      res.status(400).send('Solicitud no válida. Proporcione un estado válido (0 o 1) en el cuerpo de la solicitud.');
    }
  });
  
  app.get('/estado', (req, res) => {
    res.send({ status: ledStatus.status });
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