import express  from "express";
import { agregar, eliminar, listar } from "../controllers/contacto.controller.js";

const router = express.Router();

router.get("/listar",listar);
router.post("/agregar",agregar);
router.post("/eliminar/:id",eliminar);

export default router;
