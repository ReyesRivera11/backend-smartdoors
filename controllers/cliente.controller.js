import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cliente from '../models/cliente.modelo.js';
import { errorHandler } from "../middleware/handleErrors.js";
import nodemailer from "nodemailer"

export const registrar = async (req, res, next) => {
    const { nombre, apellido, correo, password, } = req.body;
    console.log(correo)
    try {

        const usuario = await Cliente.findOne({ correo });

        if (usuario) return next(errorHandler(400, "El email ya existe, ingrese otro correo o inicie sesión."));

        const hashedPassword = bcrypt.hashSync(password, 10);
        const nuevoUsuario = new Cliente({ nombre, apellido, correo, password: hashedPassword });
        await nuevoUsuario.save();
        res.status(201).json("Usuario creado correctamente, inicie sesión");

    } catch (error) {
        next(error);
    }

};

export const login = async (req, res, next) => {
    const { correo, password } = req.body;
    try {
        const usuario = await Cliente.findOne({ correo });

        if (!usuario) return next(errorHandler(401, "Usuario no encontrado, por favor crea una cuenta"));

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
        res.json(rest);
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
                <a href="http://localhost:5173/restaurar/${token}">Restablecer Contraseña</a>
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
    const {password} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_REST_PASS);
        const hashedPassword = bcrypt.hashSync(password,10);
        const clienteEncontrado = await Cliente.findByIdAndUpdate(decoded.id,{
                password:hashedPassword
             });
        if(!clienteEncontrado) return next(errorHandler(404,"El usuario no existe"));

        res.json({mensaje:"La contraseña se restablecio correctamente"});

        
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
