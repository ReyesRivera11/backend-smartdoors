import express  from "express";
import { agregar, eliminar, listar } from "../controllers/pregunta.controller.js";

const router = express.Router();
router.get("/listar",listar);
router.post("/agregar",agregar);
router.delete("/eliminar/:id",eliminar);

export default router;
