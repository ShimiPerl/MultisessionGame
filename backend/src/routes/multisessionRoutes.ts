import { Router } from 'express';
import { multisessionLogger } from '../middleware/multisessionLogger';
import {
  getActiveMultisessionGames,
  createMultisessionGame,
  updateMultisessionGame,
} from '../controllers/multisessionController';

const router = Router();


router.use(multisessionLogger);

// GET /api/multisession - Get all multisession games
router.get('/', getActiveMultisessionGames);

// POST /api/multisession - Create new multisession game
router.post('/', createMultisessionGame);

// PUT /api/multisession - Update multisession game
router.put('/', updateMultisessionGame);

export default router;
