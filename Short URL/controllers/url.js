
const mongoose = require('mongoose');
const URL = require('../models/url');

function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

// Handler to generate a short URL
async function handleGenerateShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortID = generateRandomString();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    const shortURL = `http://localhost:8001/${shortID}`;
    return res.json({ shortURL });
}


// Handler to get analytics
async function handleGetAnalytics(req,res){
    const shortId=req.params.shortId;
    const result=await URL.findOne({shortId});
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    })
}

module.exports = {
    handleGenerateShortURL,
    handleGetAnalytics
}
