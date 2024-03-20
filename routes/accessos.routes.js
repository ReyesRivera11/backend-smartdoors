import express from "express";
import { obtenerAccesos } from "../controllers/accesos.controller.js";
const routerAccesos = express.Router();

routerAccesos.get("/listar/:id",obtenerAccesos);
// routerAccesos.get("/ultimoAcceso/:id",obtenerAccesos);

export default routerAccesos; 

