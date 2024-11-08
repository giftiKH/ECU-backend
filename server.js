const express = require('express');
const connectDB = require('./config/db'); // Adjust path as needed
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const exhibitRoutes = require('./routes/exhibitRoutes'); // Adjust the path accordingly
const chatGroupRoutes = require('./routes/chatGroupRoutes');
const chatMessageRoutes = require('./routes/chatMessageRoutes');
const wantedSuspectRoutes = require('./routes/wantedSuspectRoutes');
const witnessRequestRoutes = require('./routes/witnessRequestRoutes');
const incidentReportRoutes = require('./routes/incidentReportRoutes');
const evidenceRequestRoutes = require('./routes/evidenceRequestRoutes');



const app = express();

// Middleware for parsing JSON bodies
app.use(express.json()); 

// Connect to MongoDB
connectDB(); // Call connectDB 


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use user routes
app.use('/api/users', userRoutes);   
app.use('/api/chats', chatGroupRoutes);
app.use('/api/exhibits', exhibitRoutes);
app.use('/api/messages', chatMessageRoutes);
app.use('/api/wanted-suspects', wantedSuspectRoutes)
app.use('/api/incident-reports', incidentReportRoutes);
app.use('/api/witness-requests', witnessRequestRoutes);
app.use('/api/evidence-requests', evidenceRequestRoutes);



// Start the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
