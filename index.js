'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

var data={};

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                data[requestBody.result.parameters.mailId]=requestBody.result.parameters.item;
            }
        }

        return res.json({
            speech: "Please open ASDA app on mobile",
            displayText: "Please open ASDA app on mobile",
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.post('/mobileapp', function (req, res) {

    var mailId='';
    console.log('mobileapp request');

    try {

        if (req.body) {
            mailId=req.body.mailId;
        }

        if(data[mailId]){
            return res.json({
            mailId: mailId,
            item: data[mailId].toUpperCase(),
            status: 'Success'
        });
        }
        else {
            return res.json({
            mailId: mailId,
            item: null,
            status: 'Mail Id not found'
        });
        }
        
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
