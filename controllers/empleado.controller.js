import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Empleados from "../models/empleados.modelo.js"
import {errorHandler} from "../middleware/handleErrors.js";

export const registrar = async(req,res,next) => {
    const {nombre,apellidos,telefono,correo,password,ciudad,calle,colonia,role}  = req.body;
    try {
        const usuarioEncontrado = await Empleados.findOne({correo});
        if(usuarioEncontrado) return next(errorHandler(400,"El correo ya esta en uso"));
        const hashedPassword = bcrypt.hashSync(password,10);
        const nuevoUsuario = new Empleados({
            nombre,
            apellidos,
            telefono,
            correo,
            password: hashedPassword,
            direccion:{
                ciudad,
                colonia,
                calle
            },
            role
        })

        await nuevoUsuario.save();
        res.status(201).json({msg:"Usuario creado correctamente"});

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    const { correo, password } = req.body;
    try {
        const usuario = await Empleados.findOne({ correo });

        if (!usuario) return next(errorHandler(401, "Usuario no encontrado"));

        const validarPassword = bcrypt.compareSync(password, usuario.password);

        if (!validarPassword) return next(errorHandler(401, "Contraseña incorrecta"));

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })

        const { password: pass, ...rest } = usuario._doc;

        res.cookie("token", token, {
            sameSite: "None",
            secure: true 
          })
        res.json(rest);
    } catch (error) {

        next(error);
    }
};

export const cerrarSesion = async (req, res, next) => {
    try {
        res.clearCookie('token', { sameSite: 'None', secure: true });
        res.json({ message: "Sesión cerrada" });
    } catch (error) {
        next(error);
    }
};


export const verificarToken = async(req,res,next) =>{
    const {token} = req.cookies;

    if(!token) return next(errorHandler(401,"No autorizado"));

    jwt.verify(token,process.env.JWT_SECRET,async(err,user)=>{

        if(err) return next(errorHandler(401,"No autorizado"));

        const usuario = await Empleados.findById(user.id);

        if(!usuario) return next(errorHandler(401,"Usuario no encontrado"));

        const { password: pass, ...rest } = usuario._doc;
        return res.status(200).json(rest);
    });
   
}