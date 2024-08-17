const express = require('express');
const { connectToMongoDB } = require("./connect");
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => console.log('Mongodb connected'));

app.use(express.json());
app.use(express.static('public'));
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    console.log(`Received shortId: ${shortId}`);
    try {
        // Find the URL entry and update visit history
        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: new Date() } } },
            { new: true }
        );

        // Handle case where the shortId does not exist
        if (!entry) {
            console.log(`No entry found for shortId: ${shortId}`);
            return res.status(404).json({ message: 'Short URL not found' });
        }

        // Validate and handle redirection
        const redirectURL = entry.redirectURL;
        if (!redirectURL || typeof redirectURL !== 'string') {
            console.log(`Invalid redirectURL: ${redirectURL}`);
            return res.status(500).json({ message: 'Invalid redirect URL' });
        }
        res.redirect(redirectURL);
    } catch (error) {
        console.error('Error finding short URL:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));