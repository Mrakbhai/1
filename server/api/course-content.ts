import { Router } from 'express';
import { storage } from '../storage';
import { insertCourseContentSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Get course content for a specific course
router.get('/courses/:id/content', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }
    
    const content = await storage.getCourseContent(courseId);
    
    return res.json(content);
  } catch (error) {
    console.error('Error fetching course content:', error);
    return res.status(500).json({ error: 'Failed to fetch course content' });
  }
});

// Create new course content
router.post('/courses/content', async (req, res) => {
  try {
    // Validate request body
    const validatedData = insertCourseContentSchema.parse(req.body);
    
    // Create content in storage
    const content = await storage.createCourseContent(validatedData);
    
    return res.status(201).json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error('Error creating course content:', error);
    return res.status(500).json({ error: 'Failed to create course content' });
  }
});

// Update course content
router.patch('/courses/content/:id', async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    
    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }
    
    // Get existing content to validate it exists
    const existingContent = await storage.getCourseContentById(contentId);
    
    if (!existingContent) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    // Validate request body
    // We need to extend the schema to make fields optional for update
    const updateContentSchema = insertCourseContentSchema.partial();
    const validatedData = updateContentSchema.parse(req.body);
    
    // Update content in storage
    const updatedContent = await storage.updateCourseContent(contentId, validatedData);
    
    return res.json(updatedContent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error('Error updating course content:', error);
    return res.status(500).json({ error: 'Failed to update course content' });
  }
});

// Delete course content
router.delete('/courses/content/:id', async (req, res) => {
  try {
    const contentId = parseInt(req.params.id);
    
    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }
    
    // Delete content in storage
    const success = await storage.deleteCourseContent(contentId);
    
    if (!success) {
      return res.status(404).json({ error: 'Content not found or could not be deleted' });
    }
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting course content:', error);
    return res.status(500).json({ error: 'Failed to delete course content' });
  }
});

export default router;