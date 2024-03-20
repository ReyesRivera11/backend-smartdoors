import express from "express";
import { agregar, editarProducto, eliminar, obtenerProducto, obtenerProductos, obtenerProductosCate } from "../controllers/productos.controller.js";

const routerProductos = express.Router();

routerProductos.post("/agregar",agregar);
routerProductos.get("/lista",obtenerProductos);
routerProductos.get("/producto/:id",obtenerProducto);
routerProductos.delete("/eliminar/:id",eliminar);
routerProductos.put("/editar/:id",editarProducto);
routerProductos.get("/productosCate/:categoria",obtenerProductosCate);


export default routerProductos;