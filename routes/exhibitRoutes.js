const express = require('express');
const router = express.Router();
const exhibitController = require('../controllers/exhibitController'); // Adjust the path accordingly

// Routes for exhibit management
router.post('/add', exhibitController.createExhibit); // Create a new exhibit
router.get('/:id', exhibitController.getExhibitById); // Get exhibit by ID
router.put('/:id', exhibitController.updateExhibit); // Update exhibit by ID
router.delete('/:id', exhibitController.deleteExhibit); // Delete exhibit by ID
router.get('/incident/:incidentId', exhibitController.getExhibitsByIncident); // Get exhibits by incident ID
router.get('/show/all', exhibitController.getAllExhibits); // Get all exhibits with optional filters
router.put('/:id/share', exhibitController.markExhibitAsShared); // Mark exhibit as shared in a chat group
router.get('/user/:userId', exhibitController.getExhibitsByUser); // Get exhibits created by a user
router.get('/evidence-request/:evidenceRequestId', exhibitController.getExhibitsWithEvidenceRequest); // Get exhibits linked to evidence request
router.put('/:id/read', exhibitController.markRequestAsRead); // Mark exhibit as read by user
router.get('/unread-count/:userId', exhibitController.countUnreadRequest); // Count unread requests for a user

module.exports = router;
