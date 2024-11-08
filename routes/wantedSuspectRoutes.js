const express = require('express');
const router = express.Router();
const wantedSuspectController = require('../controllers/wantedSuspectController'); // Adjust path accordingly

// Routes for wanted suspect management
router.post('/add', wantedSuspectController.createWantedSuspect); // Create a new wanted suspect
router.get('/:id', wantedSuspectController.getWantedSuspectById); // Get wanted suspect by ID
router.put('/:id', wantedSuspectController.updateWantedSuspect); // Update wanted suspect by ID
router.delete('/:id', wantedSuspectController.deleteWantedSuspect); // Delete wanted suspect by ID
router.get('/show/all', wantedSuspectController.getAllWantedSuspects); // Get all wanted suspects
router.put('/:id/share', wantedSuspectController.markWantedSuspectAsShared); // Mark wanted suspect as shared in a chat group
router.get('/incident/:incidentId', wantedSuspectController.getWantedSuspectsByIncident); // Get wanted suspects by incident ID
router.put('/:id/read', wantedSuspectController.markReportAsRead); // Mark report as read by user
router.get('/unread-count/:userId', wantedSuspectController.countUnreadReport); // Count unread reports for a user

module.exports = router;
