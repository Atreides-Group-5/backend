import express from 'express';
import { getRecommended, createRecommended } from '../controllers/recommendedController.js';

const router = express.Router();

router.get('/', getRecommended);
router.post('/', createRecommended);

export default router;
