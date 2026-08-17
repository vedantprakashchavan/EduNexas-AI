import { Router } from 'express';
import { documentController } from './document.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

// Upload a document
router.post('/upload', (req, res) => documentController.upload(req, res));

// AI process / extract
router.post('/:id/process', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.STAFF), (req, res) => documentController.process(req, res));

// Verify extracted data
router.patch('/:id/verify', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => documentController.verify(req, res));

// List all documents
router.get('/', (req, res) => documentController.findAll(req, res));

// Stats must be registered before /:id so "stats" is not treated as a document id.
router.get('/stats', (req, res) => documentController.getStats(req, res));

// Get single document
router.get('/:id', (req, res) => documentController.findById(req, res));

// Delete
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => documentController.delete(req, res));

export default router;
