const express = require('express');
const router = express.Router();
const {
    createIncidentReport,
    getIncidentReportById,
    updateIncidentReport,
    deleteIncidentReport,
    getAllIncidentReports,
    addEvidenceToIncidentReport,
    updateSuspectDetails,
    markIncidentReportAsShared,
    updateIncidentReportStatus,
    getIncidentReportsByUser,
    getIncidentReportsByStatus,
    markReportAsRead,
    countUnreadReport
} = require('../controllers/incidentReportController');

// Create a new incident report
router.post('/add', createIncidentReport);

// Get an incident report by ID
router.get('/:id', getIncidentReportById);

// Update an existing incident report
router.put('/:id', updateIncidentReport);

// Delete an incident report by ID
router.delete('/:id', deleteIncidentReport);

// Get all incident reports with optional filters
router.get('/show/all', getAllIncidentReports);

// Add evidence to an existing incident report
router.post('/:id/evidence', addEvidenceToIncidentReport);

// Update details of a suspect related to a specific incident report
router.put('/:id/suspects/:suspectId', updateSuspectDetails);

// Mark an incident report as shared in a chat group
router.put('/:id/share', markIncidentReportAsShared);

// Update the status of the incident report
router.put('/:id/status', updateIncidentReportStatus);

// Get incident reports created by a specific user
router.get('/user/:userId', getIncidentReportsByUser);

// Get incident reports filtered by their status
router.get('/status/:status', getIncidentReportsByStatus);

// Mark a report as read by a user
router.put('/:id/read', markReportAsRead);

// Count how many reports the user has not read yet
router.get('/user/:userId/unread-count', countUnreadReport);

module.exports = router;
