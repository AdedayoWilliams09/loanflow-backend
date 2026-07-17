// FILE: backend/src/routes/teamRoutes.js
// CREATED: New file

import express from 'express';
import { getTeamMembers, getTeamMemberById } from '../controllers/teamController.js';

const router = express.Router();

/**
 * GET /api/team
 *  "This sign says 'Team members are here!'"
 *  "Retrieves active team members"
 */
router.get('/', getTeamMembers);

/**
 * GET /api/team/:id
 *  "This sign says 'One specific team member is here!'"
 *  "Retrieves a single team member by ID"
 */
router.get('/:id', getTeamMemberById);

export default router;