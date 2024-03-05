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

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error en la conexion a mongodb"));
db.once("open", () => console.log("Conexion exitosa a MongoDB"));

app.listen(3000, () => console.log("Servidor conectado"));

//rutas
app.use("/api/cliente/", ClienteRouter);

const esp32IP = 'direccion-ip-de-tu-esp32';

app.get('/encender-led', (req, res) => {
  axios.get(`http://${esp32IP}/led/on`)
    .then(response => {
      console.log(response.data);
      res.send('LED encendido en la ESP32');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error al encender el LED');
    });
});

app.get('/apagar-led', (req, res) => {
  axios.get(`http://${esp32IP}/led/off`)
    .then(response => {
      console.log(response.data);
      res.send('LED apagado en la ESP32');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error al apagar el LED');
    });
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