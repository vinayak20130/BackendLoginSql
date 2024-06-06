const express = require('express');
const router = express.Router();
const sampleData = require('../data/sampleData.json');
const sampleData1 = require('../data/sampleData1.json');

// GET endpoint to retrieve data
router.get('/static', (req, res) => {
    res.json(sampleData);
});
router.get('/static1', (req, res) => {
    res.json(sampleData1);
});


module.exports = router;
