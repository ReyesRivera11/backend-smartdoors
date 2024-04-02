import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cliente from '../models/cliente.modelo.js';
import Empleados from '../models/empleados.modelo.js';
import Mac from "../models/mac.modelo.js"

import { errorHandler } from "../middleware/handleErrors.js";
import nodemailer from "nodemailer"

export const registrar = async (req, res, next) => {
    const { nombre, apellido, correo, password, } = req.body;
    try {

        const usuario = await Cliente.findOne({ correo });

        if (usuario) return next(errorHandler(400, 
            "El email ya existe, ingrese otro correo o inicie sesión."));

        const hashedPassword = bcrypt.hashSync(password, 10);
        const nuevoUsuario = new Cliente(
            { nombre, apellido, correo, password: hashedPassword });
        await nuevoUsuario.save();
        res.status(201).json("Usuario creado correctamente, inicie sesión");

    } catch (error) {
        next(error);
    }

};

export const login = async (req, res, next) => {
    const { correo, password } = req.body;
    console.log(password);
    try {
        const usuario = await Cliente.findOne({ correo });
        const empleado = await Empleados.findOne({ correo });
        if(usuario){
            const validarPassword = bcrypt.compareSync(password, usuario.password);

            if (!validarPassword) return next(errorHandler(401, "Contraseña incorrecta"));

            const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })

            const { password: pass, ...rest } = usuario._doc;

            res.cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "None",
            })
            return res.json(rest);
        }else if(empleado){
            const validarPassword = bcrypt.compareSync(password, empleado.password);

            if (!validarPassword) return next(errorHandler(401, "Contraseña incorrecta"));

            const token = jwt.sign({ id: empleado._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })

            const { password: pass, ...rest } = empleado._doc;

            res.cookie("token", token, {
                sameSite: "None",
                secure: true 
            })
            return res.json(rest);
        }
        return next(errorHandler(401, "Usuario no encontrado"));
    } catch (error) {

        next(error);
    }
};

export const cerrarSesion = async (req, res, next) => {
    try {
        res.clearCookie('access_token', { sameSite: 'None', secure: true });
        res.json({ message: "Sesión cerrada" });
    } catch (error) {
        next(error);
    }
};

export const validarPregunta = async (req, res, next) => {

    const {pregunta,respuesta} = req.body;
    console.log(pregunta)
    const {id} = req.params;

    try {
        const buscarUsuario = await Cliente.findById(id);
        console.log(buscarUsuario.preguntaSecreta)
        if (!buscarUsuario) return next(errorHandler(404, "El correo no esta registrado"));
        if(buscarUsuario.preguntaSecreta != pregunta){
            return next(errorHandler(401,"Credenciales invalidas"))
        }
        if(buscarUsuario.respuesta !== respuesta){
            return next(errorHandler(401,"La respuesta es invalida"))
        }
        res.status(200).json({ message: "Respuesta correcta" });
    } catch (error) {
        console.log(error)
    }
};

export const recuperarPassPregunta = async (req, res, next) => {

    const { correo} = req.body;

    try {
        const buscarUsuario = await Cliente.findOne({ correo });
        if (!buscarUsuario) return next(errorHandler(404, "El correo no esta registrado"));
        const token = jwt.sign(

            { id: buscarUsuario._id }, process.env.JWT_SECRET_REST_PASS, {
            expiresIn: "1h"
        }

        );
        
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restaurar Contraseña</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Restaurar Contraseña</h1>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="https://doorcraft.developers506.com/restaurar/${token}/${buscarUsuario._id}">
                    Restablecer Contraseña
                </a>
            </div>
            
        </body>
        </html>
    `
        enviarCorreo(buscarUsuario.correo,"Restaurar contraseña",html);
        res.cookie("token_recuperar", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
          });
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error)
    }
};

export const recuperarPass = async (req, res, next) => {

    const { correo } = req.body;

    try {
        const buscarUsuario = await Cliente.findOne({ correo });
        if (!buscarUsuario) return next(errorHandler(404, "El correo no esta registrado"));
        const token = jwt.sign(

            { id: buscarUsuario._id }, process.env.JWT_SECRET_REST_PASS, {
            expiresIn: "1h"
        }

        );
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restaurar Contraseña</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Restaurar Contraseña</h1>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="https://doorcraft.developers506.com/restaurar/${token}">Restablecer Contraseña</a>
            </div>
            
        </body>
        </html>
    `
        enviarCorreo(buscarUsuario.correo,"Restaurar contraseña",html);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error)
    }
};

export const restaurarPass = async (req, res, next) => {
    const { token } = req.params;
    const {password,correo} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_REST_PASS);
        const hashedPassword = bcrypt.hashSync(password,10);
        const clienteEncontrado = await Cliente.findById(decoded.id);
        if(clienteEncontrado.correo === correo){
            const clienteActualizar = await Cliente.findByIdAndUpdate(decoded.id,{
                password:hashedPassword
             });
             if(!clienteActualizar) return next(errorHandler(404,"El usuario no existe"));
            res.json({mensaje:"La contraseña se restablecio correctamente"});
        }else{
            return next(errorHandler(400,"El correo no esta registrado."))
        }
        
    } catch (error) {
        next(error);
    }
}

export const enviarCorreo = (correo, subject, html) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'smartdoors711@gmail.com',
            pass: 'uvim aemx pntm dcwx'
        }
    });

    var mailOptions = {
        from: 'smartdoors711@gmail.com',
        to: correo,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.send({ status: 'success' });
        }
    });
}

export const verificarToken = async(req,res,next) =>{
    const {access_token} = req.cookies;

    if(!access_token) return next(errorHandler(401,"No autorizado"));

    jwt.verify(access_token,process.env.JWT_SECRET,async(err,user)=>{

        if(err) return next(errorHandler(401,"No autorizado"));

        const usuario = await Cliente.findById(user.id);

        if(!usuario) return next(errorHandler(401,"Usuario no encontrado"));

        const { password: pass, ...rest } = usuario._doc;
        return res.status(200).json({...rest,role:"cliente"});
    });
   
}

export const usuarios = async (req,res,next) => {
    try {
        const usuarios = await Cliente.find();
        if(!usuarios){
            res.status(200).json("No se cuenta con ningun usuario.")
        }
        res.status(200).json(usuarios)
    } catch (error) {
        next(error);
    }
}
export const getUsuario = async(req,res,next) => {
    try {
        const {id} = req.params;
        const usuario = await Cliente.findById(id);
        if(!usuario) {
            return next(errorHandler(401,"El usuario no existe."))
        }
        return res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
}

export const editar = async (req, res, next) => {
    const { nombre, apellido, correo, password, preguntaSecreta,respuesta,pin} = req.body;
    const {id} = req.params;
    try {
        const buscarCliente = await Cliente.findById(id);
        if(!buscarCliente) return next(errorHandler(401,"Usuario no encontrado1"));
        if(buscarCliente.correo===correo){
            const actualizarUsuario = await Cliente.findByIdAndUpdate(id,req.body);
            if (!actualizarUsuario) return next(errorHandler(401,"Usuario no encontrado2"));
            res.status(201).json({message:"Usuario actualizado correctamente."});
        }else{
            const buscarUsuarioCorreo = await Cliente.findOne({correo});
            if(buscarUsuarioCorreo) return next(errorHandler(400,"El correo ya esta en uso."))
            const actualizarUsuario = await Cliente.findByIdAndUpdate(id,req.body);
            if (!actualizarUsuario) return next(errorHandler(401,"Usuario no encontrado3"));
            res.status(201).json({message:"Usuario actualizado correctamente."});
        }
       
    } catch (error) {
        next(error);
        console.log(error);
    }

};

export const asignarMac = async (req,res,next) => {
    const {mac,modelo,codigo} = req.body;
    const {id} = req.params;
    try {
        const buscarCliente = await Cliente.findById(id);
        const buscarMac = await Mac.findOneAndUpdate({codigo,enuso:false},{enuso: true,usuario:buscarCliente._id});
        if(!buscarMac) return next(errorHandler(401, "Codigo no disponible"));
        if(!buscarCliente) return next(errorHandler(401, "Usuario no encontrado"));
        if (!buscarCliente.puerta) {
            buscarCliente.puerta = [];
          }
        buscarCliente.puerta.push({ modelo, mac,codigoPuerta:codigo });
        await buscarCliente.save();

        return res.status(200).json({message:"Mac asignada",buscarCliente})
    } catch (error) {
        next(error);
    }
}

export const registrarPuerta = async (req,res,next) => {
    const {codigo} = req.body;
    const {id} = req.params;
    try {
        const buscarCliente = await Cliente.findById(id);
        const buscarMac = await Mac.findOneAndUpdate({codigo,enuso:false},{enuso: true,usuario:buscarCliente._id});
        if(!buscarMac) return next(errorHandler(401, "Codigo no disponible o en uso"));
        if(!buscarCliente) return next(errorHandler(401, "Usuario no encontrado"));
        if (!buscarCliente.puerta) {
            buscarCliente.puerta = [];
          }
        buscarCliente.puerta.push({ modelo:buscarMac.puerta, mac:buscarMac.mac,codigoPuerta:codigo });
        await buscarCliente.save();

        return res.status(200).json({message:"Puerta asignada",buscarCliente})
    } catch (error) {
        next(error);
    }
}

export const agregarUsuarioPermitido = async (req, res, next) => {
    const { id } = req.params;
    const { nombre, apellidos, pin, idHuella } = req.body;
    
    try {
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return next(errorHandler(404,"Cliente no encontrado"));
        }
        if (!cliente.usuariosPermitidos) {
            cliente.usuariosPermitidos = [];
          }

        cliente.usuariosPermitidos.push({ nombre, apellidos, pin, idHuella });
        await cliente.save();

        return res.status(200).json({ message: 'Usuario permitido agregado correctamente', cliente });
    } catch (error) {
        next(error);
    }
};

export const eliminarUusarioPer = async (req,res,next) => {
    const {id,idUserPer} = req.params;
    try {
        const buscarUusarioPrincila = await Cliente.findByIdAndUpdate(id,{
             $pull: { usuariosPermitidos: { _id: idUserPer } } 
        })

        if(!buscarUusarioPrincila) return next(errorHandler(404,"Usuario no encontrado"));
        return res.status(200).json("Usuario eliminado correctamente");
    } catch (error) {
        next(error);
    }
}
