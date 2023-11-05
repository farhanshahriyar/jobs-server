const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Routes



// Running Server
app.get('/', (req, res) => {
    res.send('Job World Api is Running!!');
});
// Listen
app.listen(port, () => {
    console.log(`Job World Server is running on port ${port}`);
});