import express  from "express";
import { registrar,login,cerrarSesion,recuperarPass,restaurarPass,verificarToken } from "../controllers/cliente.controller.js";

const router = express.Router();

router.post("/registrar", registrar);
router.post("/login", login);
router.get("/signout",cerrarSesion );
router.post("/recuperarPass",recuperarPass );
router.post("/restaurar-pass/:token", restaurarPass);
router.get("/verificarToken",verificarToken);


export default router;