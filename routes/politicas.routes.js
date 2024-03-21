import express from "express";
import { agregar, editar, eliminar, listar, obtenerById } from "../controllers/politicas.controller.js";

const router = express.Router();

router.get("/listar",listar);
router.delete("/eliminar/:id",eliminar);
router.get("/editar/:id",editar);
router.post("/agregar",agregar);
router.get("/getById/:id",obtenerById);

export default router;
