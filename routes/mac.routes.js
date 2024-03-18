import express from "express";
import { agregar, editar, obtenerMacs } from "../controllers/mac.controller.js";
const routerMacs = express.Router();

routerMacs.post("/agregar",agregar);
routerMacs.get("/lista",obtenerMacs);
routerMacs.put("/editar/:id",editar);


export default routerMacs;
