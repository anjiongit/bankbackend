import express from 'express';
import {
  createAccount,
  getAccounts,
  transfer,
  deposit,
  withdraw,
  getBalance,
  register,
  login
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/create', createAccount);
router.get('/all', getAccounts);
router.post('/transfer', transfer);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.get('/:id/balance', getBalance);

export default router;
