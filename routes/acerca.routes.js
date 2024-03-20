import express from "express";
import { agregar, editar, eliminar, getById, listar } from "../controllers/nosotros.controller.js";

const routerAcerca = express.Router();

routerAcerca.get("/listar",listar);
routerAcerca.post("/agregar",agregar);
routerAcerca.put("/editar/:id",editar);
routerAcerca.get("/getById/:id",getById);
routerAcerca.delete("/eliminar/:id",eliminar);


export default routerAcerca; 

