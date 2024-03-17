import express from "express";
import { agregar, editarProducto, obtenerProducto, obtenerProductos, obtenerProductosCate } from "../controllers/productos.controller.js";

const routerProductos = express.Router();

routerProductos.post("/agregar",agregar);
routerProductos.get("/lista",obtenerProductos);
routerProductos.get("/producto/:id",obtenerProducto);
routerProductos.put("/editar/:id",editarProducto);
routerProductos.get("/productosCate/:categoria",obtenerProductosCate);


export default routerProductos;