// FILE: backend/src/controllers/teamController.js


import { TeamMember } from '../models/TeamMember.js';

/**
 * Get Team Members
 * 
 *  Child Explanation:
 * "This chef looks at all the team members and shows the ones
 * that are marked as 'active'. It sorts them by order."
 * 
 *  Technical Explanation:
 * "Retrieves active team members with sorting and limit support."
 */
export const getTeamMembers = async (req, res, next) => {
  try {
    const { limit = 10, isActive = true } = req.query;
    
    const teamMembers = await TeamMember.find({ 
      isActive: isActive === 'true' || isActive === true 
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      message: 'Team members retrieved successfully',
      data: teamMembers,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Team Member
 * 
 *  Child Explanation:
 * "This chef looks at one specific team member by their ID."
 * 
 *  Technical Explanation:
 * "Retrieves a single team member by ID."
 */
export const getTeamMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const teamMember = await TeamMember.findById(id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Team member retrieved successfully',
      data: teamMember,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};