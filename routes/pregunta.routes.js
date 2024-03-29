import express from "express";
import { agregar, editar, eliminar, getPregunta, listar } from "../controllers/pregunta.controller.js";

const router = express.Router();
router.get("/listar", listar);
router.post("/agregar", agregar);
router.delete("/eliminar/:id", eliminar);
router.put("/editar/:id", editar);
router.get("/getPregunta/:id", getPregunta);

export default router;
