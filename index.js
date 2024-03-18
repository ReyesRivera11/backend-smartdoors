import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import ClienteRouter from "./routes/cliente.routes.js";
import EmpleadoRouter from "./routes/empleado.routes.js";
import CategoriaRouter from "./routes/categoria.routes.js";
import ProductosRouter from "./routes/productos.routes.js";
import AccesosRouter from "./routes/accessos.routes.js";
import MacRouter from "./routes/mac.routes.js";
import bodyParser from "body-parser";
import mqtt from "mqtt"
import Cliente from "./models/cliente.modelo.js";
import Accessos from "./models/accesos.modelo.js";
import DeviceState from "./models/deviceState.modelo.js";
import DeviceHistoric from "./models/deviceHistoric.modelo.js";
import moment from 'moment';
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

// app.post('/pin/:val/:mac', async (req, res) => {
//   const {val,mac} = req.params;
//   try {
//     const result = await Cliente.findOne({
//       $and: [{ "puerta.mac": mac }, { "pin": val }] 
//     });
//     console.log(result)
//     if(!result){
//       const valor = "incorrecto";
//       mqttClient.publish('doorcraft', valor);
//       return res.status(401).json({msg:valor});
//     }else{
//       const valor = "correcto";
//       mqttClient.publish('doorcraft', valor);
//       return res.status(200).json({msg:valor});
//     }
      
//   } catch (error) {
//     console.log(error)
//   }
// });

app.post("/estado/:mov/:puerta/:mac",async(req,res) => {
  const {mov,puerta,mac} = req.params;
  const fechaActual = moment();
  const fechaFormateada = fechaActual.format('YYYY-MM-DD HH:mm:ss');
  try {
    const encontrarEstado = await DeviceState.findOneAndUpdate(mac,{
      presencia:mov,
      estado:puerta
    });
    if(!encontrarEstado){
      const estado = new DeviceState({mac,estado:puerta,presencia:mov});
      await estado.save();
    }
    const historic = new DeviceHistoric(
      {mac,variable:"Presencia",valor:mov,fecha:fechaFormateada
      });
    await historic.save();
    const historic2 = new DeviceHistoric(
      {mac,variable:"PuertaEstado",valor:puerta,fecha:fechaFormateada
      });
    await historic2.save();

    return res.status(200).json("Registro exitoso");

  } catch (error) {
    
  }
});

app.post('/pin-acceso/:pin/:mac', async (req, res) => {
  const {pin,mac} = req.params;
  const fechaActual = moment();
  const fechaFormateada = fechaActual.format('YYYY-MM-DD HH:mm:ss');
  try {
    const usuarioPermitido = await Cliente.findOne(
      { "puerta.mac": mac,"usuariosPermitidos.pin":pin }, 
      { "usuariosPermitidos.$": 1 } 
    );
    const usuarioNormal = await Cliente.findOne({
      "puerta.mac": mac,
      pin
    });
    
    if(usuarioNormal){
      try {
        // return res.status(200).json(usuarioNormal._id);
        const valor = "correcto";
        mqttClient.publish('doorcraft', valor);
        const nuevoAcceso = new Accessos(
          {
            nombre:usuarioNormal.nombre,apellido:usuarioNormal.apellido,fecha:fechaFormateada,
            idUsuario:usuarioNormal._id
          }
        )
        await nuevoAcceso.save();
        return res.status(200).json({msg:"Acceso registrada correctamente"});
      } catch (error) {
        console.log(error);
      }
    }

    if(usuarioPermitido){
      try {
        // const buscarUsuario = await Cliente.findOne({})
        const valor = "correcto";
        mqttClient.publish('doorcraft', valor);
        const nuevoAcceso = new Accessos({
          nombre:usuarioPermitido.usuariosPermitidos[0].nombre,
          apellido:usuarioPermitido.usuariosPermitidos[0].apellidos,
          fecha:fechaFormateada,
          idUsuario:usuarioPermitido._id
        })
        await nuevoAcceso.save();
        return res.status(200).json({msg:"Acceso registrada correctamente"});
        // return res.status(200).json(usuarioPermitido.usuariosPermitidos[0]._id);
      } catch (error) {
        console.log(error);
      }
    }
    const valor = "incorrecto";
    mqttClient.publish('doorcraft', valor);
    res.status(404).json("No se encontro ningun usuario");
  } catch (error) {
    console.log(error)
  }
});

app.post('/huella-acceso/:id/:mac', async (req, res) => {
  const {id,mac} = req.params;
  const fechaActual = moment();
  const fechaFormateada = fechaActual.format('YYYY-MM-DD HH:mm:ss');
  try {
    const usuarioPermitido = await Cliente.findOne(
      { "puerta.mac": mac,"usuariosPermitidos.idHuella":id }, 
      { "usuariosPermitidos.$": 1 } 
    );
    const usuarioNormal = await Cliente.findOne({
      "puerta.mac": mac,
      huella: id
    });
    
    if(usuarioNormal){
      try {
        // return res.status(200).json(usuarioNormal._id);
        const nuevoAcceso = new Accessos({
          nombre:usuarioNormal.nombre,apellido:usuarioNormal.apellido,fecha:fechaFormateada,
          idUsuario:usuarioNormal._id
        })
        await nuevoAcceso.save();
        return res.status(200).json({msg:"Acceso registrada correctamente"});
      } catch (error) {
        console.log(error);
      }
    }

    if(usuarioPermitido){
      try {
        // const buscarUsuario = await Cliente.findOne({})
        const nuevoAcceso = new Accessos({
          nombre:usuarioPermitido.usuariosPermitidos[0].nombre,
          apellido:usuarioPermitido.usuariosPermitidos[0].apellidos,
          fecha:fechaFormateada,
          idUsuario:usuarioPermitido._id
        })
        await nuevoAcceso.save();
        return res.status(200).json({msg:"Acceso registrada correctamente"});
        // return res.status(200).json(usuarioPermitido.usuariosPermitidos[0]._id);
      } catch (error) {
        console.log(error);
      }
    }
    res.status(404).json("No se encontro ningun usuario");
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
app.use("/api/mac", MacRouter); 
app.use("/api/accesos", AccesosRouter); 


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