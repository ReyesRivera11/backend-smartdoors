import express from "express";
import { agregar, obtenerProductos } from "../controllers/productos.controller.js";

const routerProductos = express.Router();

routerProductos.post("/agregar",agregar);
routerProductos.get("/lista",obtenerProductos);

export default routerProductos;