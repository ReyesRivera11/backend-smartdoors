import express from "express";
import { registrar,login,cerrarSesion,verificarToken } from "../controllers/empleado.controller.js";


const routerEm = express.Router();
routerEm.post("/registrar", registrar);
routerEm.post("/login", login);
routerEm.post("/salir", cerrarSesion);
routerEm.get("/verificarToken", verificarToken);

export default routerEm;