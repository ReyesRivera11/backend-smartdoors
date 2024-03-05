import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import ClienteRouter from "./routes/cliente.routes.js"
import bodyParser from "body-parser";

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

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error en la conexion a mongodb"));
db.once("open", () => console.log("Conexion exitosa a MongoDB"));

app.listen(3000, () => console.log("Servidor conectado"));

//rutas
app.use("/api/cliente/", ClienteRouter);
const pinLed = 13; // Puerto digital donde está conectado tu LED
let ledEncendido = false;
app.get('/led/encender', (req, res) => {
    if (!ledEncendido) {
        // Enciende el LED solo si no está encendido
        ledEncendido = true;
        // Aquí deberías agregar el código para encender el LED usando Arduino o cualquier dispositivo
        console.log('LED encendido');
        res.status(200).send('LED encendido');
    } else {
        res.status(400).send('El LED ya está encendido');
    }
});
app.get('/led/apagar', (req, res) => {
    if (ledEncendido) {
        // Apaga el LED solo si está encendido
        ledEncendido = false;
        // Aquí deberías agregar el código para apagar el LED usando Arduino o cualquier dispositivo
        console.log('LED apagado');
        res.status(200).send('LED apagado');
    } else {
        res.status(400).send('El LED ya está apagado');
    }
});

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