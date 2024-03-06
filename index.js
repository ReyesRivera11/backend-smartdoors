import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import ClienteRouter from "./routes/cliente.routes.js"
import bodyParser from "body-parser";
import axios from 'axios';
import mqtt from "mqtt"
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

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
app.get('/ledController', (req, res) => {
    const { valor } = req.body;
  
    if (valor === "1") {
      ledStatus.status = 1;
      res.send("Encendido");
    } else if (valor === "0") {
      ledStatus.status = 0;
      res.send("Apagado");
    } else {
      res.status(400).send('Solicitud no válida. Proporcione un valor válido (0 o 1) en el cuerpo de la solicitud.');
    }
  });
  
  app.get('/estado', (req, res) => {
    res.send({ status: ledStatus.status });
  });

function enviarMensaje(estado) {
  const message = estado === "ON" ? "ON" : "OFF";
  mqttClient.publish('doorcraft', message);
  console.log(`Mensaje MQTT enviado: ${message}`);
}
app.get('/app/data-afnpg/endpoint/EcoNido', (req, res) => {
  const { estado } = req.query; // Use req.query to get parameters from the URL

  if (!estado || (estado !== "ON" && estado !== "OFF")) {
    return res.status(400).send('Invalid or missing estado value');
  }

  enviarMensaje(estado);

  res.status(200).send(`Datos ${estado === "ON" ? 'Encendido' : 'Apagado'} recibidos y procesados`);
});
app.post('/app/data-afnpg/endpoint/EcoNido', async (req, res) => {
  const { estado } = req.body;

  if (estado !== "ON" && estado !== "OFF") {
    return res.status(400).send('Invalid estado value');
  }

  enviarMensaje(estado);

  res.status(200).send(`Datos ${estado === "ON" ? 'Encendido' : 'Apagado'} recibidos y procesados`);
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