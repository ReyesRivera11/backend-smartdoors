import express  from "express";
import { registrar,login,cerrarSesion,recuperarPass,restaurarPass,verificarToken, usuarios, getUsuario } from "../controllers/cliente.controller.js";

const router = express.Router();

router.post("/registrar", registrar);
router.post("/login", login);
router.get("/signout",cerrarSesion );
router.post("/recuperarPass",recuperarPass );
router.post("/restaurar-pass/:token", restaurarPass);
router.get("/verificarToken",verificarToken);
router.get("/lista-usuarios",usuarios);
router.get("/get-usuario/:id",getUsuario);


export default router;