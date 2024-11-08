const express = require('express');
const router = express.Router();
const witnessRequestController = require('../controllers/witnessRequestController');

// Routes for witness request management
router.post('/add', witnessRequestController.createWitnessRequest); // Create a new witness request
router.get('/:id', witnessRequestController.getWitnessRequestById); // Get witness request by ID
router.put('/:id', witnessRequestController.updateWitnessRequest); // Update witness request by ID
router.delete('/:id', witnessRequestController.deleteWitnessRequest); // Delete witness request by ID 
router.get('/incident/:incidentId', witnessRequestController.getWitnessRequestsByIncident); // Get witness requests by incident ID
router.get('/show/all', witnessRequestController.getAllWitnessRequests); // Get all witness requests with optional filters
router.put('/:id/share', witnessRequestController.markWitnessRequestAsShared); // Mark witness request as shared in a chat group
router.get('/user/:userId', witnessRequestController.getWitnessRequestsByUser); // Get witness requests by user
router.get('/upcoming', witnessRequestController.getUpcomingWitnessRequests); // Get upcoming witness requests
router.put('/:id/read', witnessRequestController.markRequestAsRead); // Mark request as read by user
router.get('/unread-count/:userId', witnessRequestController.countUnreadRequest); // Count unread requests for a user

module.exports = router;   
 