import express from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

/** Router function */
const router = express.Router();

router.put('/update', extractJWT, controller.update);
router.delete('/remove', extractJWT, controller.remove);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/get/all', controller.getAllUsers);
router.get('/get/one', controller.getOneUser);

export = router;
