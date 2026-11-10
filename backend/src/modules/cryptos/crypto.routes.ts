import { Router } from "express";
import { cryptoController } from "./crypto.controller.js";

const cryptoRoutes = Router();

cryptoRoutes.get('/markets', (req, res) => cryptoController.getTop(req, res));
cryptoRoutes.get('/:id', (req, res) => cryptoController.getDetails(req, res));
cryptoRoutes.get('/:id/history', (req, res) => cryptoController.getHistory(req, res));

export default cryptoRoutes;