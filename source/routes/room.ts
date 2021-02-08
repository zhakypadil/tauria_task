import express from 'express';
import controller from '../controllers/room';
import extractJWT from '../middleware/extractJWT';

/** Router function */
const router = express.Router();

router.post('/create', extractJWT, controller.create);
router.put('/change', extractJWT, controller.change);
router.put('/join', extractJWT, controller.join);
router.put('/leave', extractJWT, controller.leave);
router.get('/get/one', controller.roominfo);
router.get('/get/all', extractJWT, controller.roomsinfo);

export = router;
