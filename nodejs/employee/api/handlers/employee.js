import mongoose from "mongoose";
import { Router } from 'express';

const router = Router();

// Get all employees
router.get('/',  async (req, res) => {
    res.send({ banana: 'Yellow' });
});

export default router;