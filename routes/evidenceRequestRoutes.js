const express = require('express');
const {
    createEvidenceRequest,
    getEvidenceRequestById,
    updateEvidenceRequest,
    deleteEvidenceRequest,
    getEvidenceRequestsByIncident,
    getAllEvidenceRequests,
    markEvidenceRequestAsShared,
    getEvidenceRequestsByUser,
    getEvidenceRequestsSharedInChat,
    markRequestAsRead,
    countUnreadRequest 
} = require('../controllers/evidenceRequestController'); // Adjust the path as necessary

const router = express.Router();

// Create Evidence Request
router.post('/add', createEvidenceRequest);

// Get Evidence Request By ID
router.get('/:id', getEvidenceRequestById);

// Update Evidence Request
router.put('/:id', updateEvidenceRequest);

// Delete Evidence Request
router.delete('/:id', deleteEvidenceRequest);

// Get Evidence Requests By Incident
router.get('/incident/:incidentId', getEvidenceRequestsByIncident);

// Get All Evidence Requests
router.get('/', getAllEvidenceRequests);

// Mark Evidence Request As Shared
router.patch('/:id/share', markEvidenceRequestAsShared);

// Get Evidence Requests By User
router.get('/user/:userId', getEvidenceRequestsByUser);

// Get Evidence Requests Shared In Chat
router.get('/shared/shared-in-chat', getEvidenceRequestsSharedInChat);

// Mark Request As Read
router.patch('/:id/read', markRequestAsRead); 

// Count Unread Request
router.get('/unread-count/:userId', countUnreadRequest);

module.exports = router;
