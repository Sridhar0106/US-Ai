import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Roadmap from '../models/Roadmap';
import { generateRoadmap } from '../config/gemini';

export const createRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const { weakSkill } = req.body;
    const userId = req.user?.id;

    if (!weakSkill) {
      return res.status(400).json({ message: 'Weak skill parameter is required.' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    // Check if roadmap already exists for this skill
    let roadmap = await Roadmap.findOne({ userId, weakSkill: { $regex: new RegExp(`^${weakSkill}$`, 'i') } });
    
    if (roadmap) {
      return res.status(200).json(roadmap);
    }

    // Call Gemini API to generate roadmap content
    const data = await generateRoadmap(weakSkill);

    // Save to Database
    roadmap = await Roadmap.create({
      userId,
      weakSkill,
      resources: data.resources.map(r => ({
        title: r.title,
        type: r.type,
        url: r.url,
        completed: false,
      })),
    });

    res.status(201).json(roadmap);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error generating roadmap.' });
  }
};

export const getUserRoadmaps = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(roadmaps);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching roadmaps.' });
  }
};

export const updateRoadmapProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { roadmapId, resourceId } = req.params;
    const { completed } = req.body;
    const userId = req.user?.id;

    if (completed === undefined) {
      return res.status(400).json({ message: 'Completed parameter (boolean) is required.' });
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found.' });
    }

    if (roadmap.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden. This is not your roadmap.' });
    }

    const resource = (roadmap.resources as any).id(resourceId as string);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found in this roadmap.' });
    }

    // Update state
    resource.completed = completed;
    await roadmap.save();

    res.status(200).json({
      message: 'Roadmap progress updated.',
      roadmap,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating roadmap.' });
  }
};
