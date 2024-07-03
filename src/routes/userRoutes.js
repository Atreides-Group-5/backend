import express from 'express';
import { exampleControllerFunction } from '../controllers/userController.js';

const router = express.Router();

router.get('/example', exampleControllerFunction);

export default router;
