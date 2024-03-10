import express from "express";
import { agregar, editar, eliminar, listar } from "../controllers/categoria.controller.js";

const routerCategoria = express.Router();

routerCategoria.post("/agregar",agregar);
routerCategoria.get("/listar",listar);
routerCategoria.post("/editar/:id",editar);
routerCategoria.delete("/eliminar/:id",eliminar);

export default routerCategoria; 