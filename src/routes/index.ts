import express from 'express';
const router = express.Router();

import {
  createGame,
  getGame,
  updateGame,
  removeGame,
  wipeInfo,
  getAllGames,
  getIpAdress,
} from '@controllers/games';

router.get('/games', getAllGames);
router.post('/games', createGame);
router.get('/games/:ip', getGame);
router.patch('/games/:ip/update', updateGame);
router.delete('/games/:ip/remove', removeGame);
//
router.delete('/games/wipe', wipeInfo);
router.get('/ip', getIpAdress);

export default router;
