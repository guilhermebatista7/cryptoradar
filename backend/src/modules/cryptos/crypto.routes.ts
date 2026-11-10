import { Router } from "express";
import { cryptoController } from "./crypto.controller.js";

const cryptoRoutes = Router();

cryptoRoutes.get('/markets', (req, res) => cryptoController.getTop(req, res));

export default cryptoRoutes;