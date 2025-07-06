import { Router } from 'express';

export const router = Router();

router.get('/', async (req, res) => {
    res.send({});
});

export default router;
