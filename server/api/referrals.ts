import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { nanoid } from 'nanoid';
import { z } from 'zod';

// Extend Express Request type to include authenticated user
declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): boolean;
      user?: any;
    }
  }
}

const router = Router();

// Generate a new referral code
router.post('/api/referrals', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user!.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check if the course exists
    const course = await storage.getCourse(Number(courseId));
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Generate a unique referral code
    const code = `${nanoid(8)}`;

    // Create the referral
    const referral = await storage.createReferral({
      userId,
      courseId: Number(courseId),
      code,
    });

    return res.status(201).json(referral);
  } catch (error: any) {
    console.error('Error generating referral code:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Get all referrals for the current user
router.get('/api/referrals', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user!.id;
    const referrals = await storage.getUserReferrals(userId);

    return res.json(referrals);
  } catch (error: any) {
    console.error('Error fetching referrals:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Validate a referral code
router.get('/api/referrals/:code/validate', async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ message: 'Referral code is required' });
    }

    const referral = await storage.getReferral(code);
    if (!referral) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    // Get course details
    const course = await storage.getCourse(referral.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Don't allow self-referral
    if (req.isAuthenticated() && req.user!.id === referral.userId) {
      return res.status(400).json({ message: 'You cannot use your own referral code' });
    }

    return res.json({
      valid: true,
      referral: {
        ...referral,
        course: {
          id: course.id,
          title: course.title,
          image: course.image,
        },
      },
    });
  } catch (error: any) {
    console.error('Error validating referral code:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Apply a referral code during purchase
router.post('/api/referrals/:code/apply', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { code } = req.params;
    const userId = req.user!.id;

    if (!code) {
      return res.status(400).json({ message: 'Referral code is required' });
    }

    const referral = await storage.getReferral(code);
    if (!referral) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    // Don't allow self-referral
    if (userId === referral.userId) {
      return res.status(400).json({ message: 'You cannot use your own referral code' });
    }

    // Check if user already purchased this course
    const existingPurchase = await storage.getUserCourse(userId, referral.courseId);
    if (existingPurchase) {
      return res.status(400).json({ message: 'You already own this course' });
    }

    // Create a user course entry with the referral code
    const userCourse = await storage.purchaseCourse({
      userId,
      courseId: referral.courseId,
      referralCode: code,
      referredBy: String(referral.userId),
    });

    // Update the referral usage count
    await storage.updateReferralUsedCount(referral.id);

    // Record analytics event
    await storage.recordEvent(userId, 'referral_used', {
      referralId: referral.id,
      courseId: referral.courseId,
      referrerId: referral.userId,
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Referral applied successfully',
      userCourse 
    });
  } catch (error: any) {
    console.error('Error applying referral code:', error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;