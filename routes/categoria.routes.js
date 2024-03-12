import express from "express";
import { agregar, burcarPorId, editar, eliminar, listar } from "../controllers/categoria.controller.js";

const routerCategoria = express.Router();

routerCategoria.post("/agregar",agregar);
routerCategoria.get("/listar",listar);
routerCategoria.get("/buscar/:id",burcarPorId);
routerCategoria.put("/editar/:id",editar);
routerCategoria.delete("/eliminar/:id",eliminar);

export default routerCategoria; 