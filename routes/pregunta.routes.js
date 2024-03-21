import express  from "express";
import { agregar, listar } from "../controllers/pregunta.controller.js";

const router = express.Router();
router.get("/listar",listar);
router.post("/agregar",agregar);

export default router;
