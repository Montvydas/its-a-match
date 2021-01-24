import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    return res.send('To get levels use: /api/levels/ ' + 'To get specific level use: /api/levels/{level name}');
});

export default router;