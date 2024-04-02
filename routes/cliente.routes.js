import express  from "express";
import { registrar,login,cerrarSesion,recuperarPass,restaurarPass,verificarToken, usuarios, getUsuario, editar, asignarMac, agregarUsuarioPermitido, eliminarUusarioPer, recuperarPassPregunta, validarPregunta, registrarPuerta } from "../controllers/cliente.controller.js";

const router = express.Router();

router.post("/registrar", registrar);
router.put("/actualizar/:id", editar);
router.put("/asignar-mac/:id", asignarMac);
router.post("/login", login);
router.get("/signout",cerrarSesion );
router.post("/recuperarPass",recuperarPass );
router.post("/recuperarPregunta",recuperarPassPregunta);
router.post("/validarPregunta/:id",validarPregunta);
router.post("/restaurar-pass/:token", restaurarPass);
router.get("/verificarToken",verificarToken);
router.get("/lista-usuarios",usuarios);
router.get("/get-usuario/:id",getUsuario);
router.post("/usuarioPer/:id",agregarUsuarioPermitido);
router.delete("/eliminarUserPer/:id/:idUserPer",eliminarUusarioPer);
router.put("/registrarPuerta/:id",registrarPuerta);


export default router;