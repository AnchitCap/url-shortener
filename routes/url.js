const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const config = require('config');
const shortid = require('shortid');

const Url = require('../models/Url');

// @route POST /api/url/shorten
// @desc  Create short URL
router.post('/shorten', async(req,res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseURl');

    // Check long URL 
    if(!validUrl.isUri(baseUrl)) {
        return res.status(400).json('Invalid base url');
    } 

    // Create URL code 
    const urlCode = shortid.generate();

    // Check long URL 
    if(!validUrl.isUri(longUrl)) {
        res.status(400).json('Invalid long url');
    }
    else {
        try {
            let url = await Url.findOne({ longUrl });

            if(url) {
                res.json(url);
            }
            else {
                const shortUrl = baseUrl + '/' + urlCode;
                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date : new Date()
                });
                await url.save();
                
                res.json(url);
            }

        } catch (err) {
            console.log(err);
            res.status(500).json('Server Error');
        }
    }

})

module.exports = router;