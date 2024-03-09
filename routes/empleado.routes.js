import express from "express";
import { registrar,login } from "../controllers/empleado.controller.js";
import { cerrarSesion } from "../controllers/cliente.controller.js";

const routerEm = express.Router();
routerEm.post("/registrar", registrar);
routerEm.post("/login", login);
routerEm.post("/salir", cerrarSesion);

export default routerEm;