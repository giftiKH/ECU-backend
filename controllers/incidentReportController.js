const IncidentReport = require('../models/IncidentReport');
const ChatMessage = require('../models/ChatMessage'); // Make sure to require your ChatMessage model
const WantedSuspect = require('../models/WantedSuspect')


// Create a new incident report
exports.createIncidentReport = async (req, res) => {
    try {
        const {
            description = '',
            reportingOfficer = '',
            location = '',
            date = null,
            suspects = [],
            evidence = [],
            createdBy = null,
            status = 'Open', // assuming 'open' is a string 
            sharedInChat = false,
            chatGroupId = null,
        } = req.body;  

        const processedSuspects = suspects.map(suspect => {
            const {
                name = '',
                nationality = '',
                age = null,
                picture = '',
                arrested = false,
                arrestDetails = {},
                wantedAlert = false
            } = suspect;

            return {
                name,
                nationality,
                age,
                picture,
                arrested,
                arrestDetails: arrestDetails ? {
                    place: arrestDetails.place || '',
                    date: arrestDetails.date || null,
                    lawUsed: arrestDetails.lawUsed || '',
                    agency: arrestDetails.agency || ''
                } : {
                    place: '',
                    date: null,
                    lawUsed: '',
                    agency: ''
                },
                wantedAlert
            };
        });

        const processedEvidence = evidence.map(ev => {
            const {
                files = [],
                description = ''
            } = ev;

            return {
                files,
                description
            };
        });

        const newIncidentReport = new IncidentReport({
            description,
            reportingOfficer,
            location,
            date,
            createdBy,
            suspects: processedSuspects,
            evidence: processedEvidence,
            status,
            sharedInChat,
            chatGroupId,
            readBy: [{ userId: createdBy }] 
        });

        await newIncidentReport.save();

        if (sharedInChat && chatGroupId) {
            const chatMessage = new ChatMessage({
                sender: createdBy,
                chatGroup: chatGroupId,
                content: description,
                messageType: 'incidentReport',
                incidentReport: newIncidentReport._id,
                readBy: [{ userId: createdBy }]
            });

            await chatMessage.save();
        }

        // Loop through suspects to create wanted suspects
        for (const suspect of processedSuspects) {
            const { name, nationality, age, picture, arrested, wantedAlert } = suspect;

            if (!arrested && wantedAlert) {
                const wantedSuspect = new WantedSuspect({
                    name: name || '', // Using name from the suspect
                    nationality: nationality || '', // Using nationality from the suspect
                    image: picture || '', // Using picture from the suspect
                    age: age || null, // Using age from the suspect
                    agencyReported: (await User.findById(createdBy)).organization, // Fetch organization from user data
                    incidentAssociated: newIncidentReport._id,
                    createdBy,
                    sharedInChat,
                    chatGroupId,
                    sender: createdBy,
                    lastKnownLocation: location, // Using the location from the incident
                });

                // Save the wanted suspect to the database
                await wantedSuspect.save();
            }
        }

        res.status(201).json(newIncidentReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get an incident report by ID
exports.getIncidentReportById = async (req, res) => {
    try {
        const incidentReport = await IncidentReport.findById(req.params.id);
        if (!incidentReport) return res.status(404).json({ message: 'Incident report not found' });
        res.status(200).json(incidentReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing incident report
exports.updateIncidentReport = async (req, res) => {
    try {
        const {
            description = '',
            reportingOfficer = '',
            location = '',
            date = null,
            suspects,
            evidence
        } = req.body;

        const updatedData = {
            description,
            reportingOfficer,
            location,
            date,
            suspects: suspects ? suspects.map(suspect => {
                const {
                    name = '',
                    nationality = '',
                    age = null,
                    picture = '',
                    arrested = null,
                    arrestDetails = {},
                    wantedAlert = null
                } = suspect;

                return {
                    name,
                    nationality,
                    age,
                    picture,
                    arrested,
                    arrestDetails: arrestDetails ? {
                        place: arrestDetails.place || '',
                        date: arrestDetails.date || null,
                        lawUsed: arrestDetails.lawUsed || '',
                        agency: arrestDetails.agency || ''
                    } : {
                        place: '',
                        date: null,
                        lawUsed: '',
                        agency: ''
                    },
                    wantedAlert
                };
            }) : undefined,
            evidence: evidence ? evidence.map(ev => {
                const {
                    files = [],
                    description = ''
                } = ev;

                return {
                    files,
                    description
                };
            }) : undefined,
        };

        const updatedIncidentReport = await IncidentReport.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!updatedIncidentReport) return res.status(404).json({ message: 'Incident report not found' });
        
        res.status(200).json(updatedIncidentReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an incident report by ID
exports.deleteIncidentReport = async (req, res) => {
    try {
        const deletedIncidentReport = await IncidentReport.findByIdAndDelete(req.params.id);
        if (!deletedIncidentReport) return res.status(404).json({ message: 'Incident report not found' });
        res.status(200).json({ message: 'Incident report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all incident reports with optional filters
exports.getAllIncidentReports = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const incidentReports = await IncidentReport.find(filter);
        res.status(200).json(incidentReports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add evidence to an existing incident report
exports.addEvidenceToIncidentReport = async (req, res) => {
    try {
        const { files = [], description = '' } = req.body;

        const updatedIncidentReport = await IncidentReport.findByIdAndUpdate(
            req.params.id,
            {
                $push: { evidence: { files, description } }
            },
            { new: true }
        );

        if (!updatedIncidentReport) return res.status(404).json({ message: 'Incident report not found' });
        
        res.status(200).json(updatedIncidentReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update details of a suspect related to a specific incident report
exports.updateSuspectDetails = async (req, res) => {
    try {
        const { suspectId } = req.params;
        const suspectUpdates = req.body; // This should include details for the suspect

        const updatedIncidentReport = await IncidentReport.findOneAndUpdate(
            { "suspects._id": suspectId },
            { $set: { "suspects.$": suspectUpdates } },
            { new: true }
        );

        if (!updatedIncidentReport) return res.status(404).json({ message: 'Incident report or suspect not found' });
        
        res.status(200).json(updatedIncidentReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark an incident report as shared in a chat group
exports.markIncidentReportAsShared = async (req, res) => {
    try {
        const { chatGroupId } = req.body;

        const updatedIncidentReport = await IncidentReport.findByIdAndUpdate(
            req.params.id,
            {
                sharedInChat: true,
                chatGroupId
            },
            { new: true }
        );

        if (!updatedIncidentReport) return res.status(404).json({ message: 'Incident report not found' });
        
        res.status(200).json(updatedIncidentReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update the status of the incident report
exports.updateIncidentReportStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updatedIncidentReport = await IncidentReport.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedIncidentReport) return res.status(404).json({ message: 'Incident report not found' });
        
        res.status(200).json(updatedIncidentReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get incident reports created by a specific user
exports.getIncidentReportsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reports = await IncidentReport.find({ createdBy: userId });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get incident reports filtered by their status
exports.getIncidentReportsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const reports = await IncidentReport.find({ status });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark a report as read by a user
exports.markReportAsRead = async (req, res) => {
    try {
        const { userId } = req.body;

        const updatedIncidentReport = await IncidentReport.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { readBy: { userId, readAt: new Date() } }
            },
            { new: true }
        );

        if (!updatedIncidentReport) return res.status(404).json({ message: 'Incident report not found' });
        
        res.status(200).json(updatedIncidentReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Count how many reports the user has not read yet
exports.countUnreadReport = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const count = await IncidentReport.countDocuments({
            "readBy.userId": { $ne: userId }
        });

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
