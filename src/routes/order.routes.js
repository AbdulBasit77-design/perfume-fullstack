import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, myOrders, listOrders, setStatus } from '../controllers/order.controller.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, myOrders);
router.get('/', protect, adminOnly, listOrders);
router.patch('/:id/status', protect, adminOnly, setStatus);

export default router;
