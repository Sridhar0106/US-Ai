import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Interview from '../models/Interview';
import Resume from '../models/Resume';
import Roadmap from '../models/Roadmap';

export const getPlatformStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalInterviews = await Interview.countDocuments({});
    const totalResumes = await Resume.countDocuments({});
    const totalRoadmaps = await Roadmap.countDocuments({});

    // Calculate average score
    const completedInterviews = await Interview.find({ status: 'completed' });
    const scoreSum = completedInterviews.reduce((acc, i) => acc + (i.finalReport?.overallScore || 0), 0);
    const avgScore = completedInterviews.length 
      ? parseFloat((scoreSum / completedInterviews.length).toFixed(2)) 
      : 0;

    // Role-wise statistics
    const roleStats = await Interview.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Create default roles count array if empty
    const roleDistribution = roleStats.map(stat => ({
      role: stat._id,
      count: stat.count,
    }));

    // Weekly registration trends (aggregated)
    const usersTrend = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    res.status(200).json({
      totalUsers,
      totalInterviews,
      totalResumes,
      totalRoadmaps,
      avgScore,
      roleDistribution,
      registrationTrend: usersTrend.map(t => ({ date: t._id, count: t.count })),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching platform statistics.' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching users.' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid userId or role selection.' });
    }

    // Protect super admin from self modification
    if (userId === req.user?.id) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'User role updated successfully.',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating user role.' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (id === req.user?.id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Clean up user related data
    await Interview.deleteMany({ userId: id });
    await Resume.deleteMany({ userId: id });
    await Roadmap.deleteMany({ userId: id });

    res.status(200).json({ message: 'User and all associated data deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting user.' });
  }
};
