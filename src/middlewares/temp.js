import express from 'express';
import { exampleControllerFunction } from '../controllers/temp.js';

const router = express.Router();

router.get('/example', exampleControllerFunction);

export default router;