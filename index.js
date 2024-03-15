import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import ClienteRouter from "./routes/cliente.routes.js";
import EmpleadoRouter from "./routes/empleado.routes.js";
import CategoriaRouter from "./routes/categoria.routes.js";
import ProductosRouter from "./routes/productos.routes.js";
import bodyParser from "body-parser";
import axios from 'axios';
import mqtt from "mqtt"
import Cliente from "./models/cliente.modelo.js"
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL_DATABASE, {
    useNewUrlParser: true,
});

// const ledStatus = { status: 0 };
// app.get('/ledController', (req, res) => {
//     const { valor } = req.body;
  
//     if (valor === "1") {
//       ledStatus.status = 1;
//       res.send("Encendido");
//     } else if (valor === "0") {
//       ledStatus.status = 0;
//       res.send("Apagado");
//     } else {
//       res.status(400).send('Solicitud no válida. Proporcione un valor válido (0 o 1) en el cuerpo de la solicitud.');
//     }
//   });
  
//   app.get('/estado', (req, res) => {
//     res.send({ status: ledStatus.status });
//   });

function enviarMensaje(estado) {
  const message = estado === "ON" ? "ON" : "OFF";
  mqttClient.publish('doorcraft', message);
  console.log(`Mensaje MQTT enviado: ${message}`);
}
// app.get('/app/data-afnpg/endpoint/EcoNido', (req, res) => {
//   const { estado } = req.query; // Use req.query to get parameters from the URL

//   if (!estado || (estado !== "ON" && estado !== "OFF")) {
//     return res.status(400).send('Invalid or missing estado value');
//   }

//   enviarMensaje(estado);

//   res.status(200).send(`Datos ${estado === "ON" ? 'Encendido' : 'Apagado'} recibidos y procesados`);
// });
app.post('/control-led', async (req, res) => {
  const { estado } = req.body;
  if (estado !== "ON" && estado !== "OFF") {
    return res.status(400).send('Invalid estado value');
  }
  enviarMensaje(estado);
  res.status(200).send(`Datos ${estado === "ON" ? 'Encendido' : 'Apagado'} recibidos y procesados`);
});

app.post('/pin/:val', async (req, res) => {
  const {val} = req.params;
  try {
    const result = await Cliente.findOne({pin:val});
    if(!result){
      const valor = "incorrecto";
      mqttClient.publish('doorcraft', valor);
      return res.status(401).json({msg:valor});
    }else{
      const valor = "correcto";
      mqttClient.publish('doorcraft', valor);
      return res.status(200).json({msg:valor});
    }
      
  } catch (error) {
    console.log(error)
  }
});


function enviarMensajeId(huella) {
  mqttClient.publish('doorcraft', huella);
  console.log(`Mensaje MQTT enviado: ${huella}`);
}
app.post('/huella', async (req, res) => {
  const { huella } = req.body;
  enviarMensajeId(huella);
  res.status(200).send(`Huella enviada ${huella}`);
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error en la conexion a mongodb"));
db.once("open", () => console.log("Conexion exitosa a MongoDB"));

app.listen(3000, () => console.log("Servidor conectado"));

//rutas

app.use("/api/cliente/", ClienteRouter);
app.use("/api/empleado", EmpleadoRouter);
app.use("/api/categoria", CategoriaRouter); 
app.use("/api/productos", ProductosRouter); 


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