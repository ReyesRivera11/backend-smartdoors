import express  from "express";
import { listar } from "../controllers/pregunta.controller.js";

const router = express.Router();
router.get("/listar",listar)

export default router;
