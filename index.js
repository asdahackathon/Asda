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
            var body = req.body;
            var mailId='';

            switch(body.result.action){
                case 'asdaItem':
                for(var i of body.result.contexts){
                    if(i.name=='mail-set'){
                        mailId=i.parameters.mailId;
                    }
                }
                data[mailId]={'item':body.result.parameters.item, 'tab':'browse'};
                return res.json({
                        speech: "Please open asda app on mobile. Would you like to view related offers?",
                        displayText: "Please open asda app on mobile. Would you like to view related offers?",
                        source: 'apiai-webhook'
                    });
                break;

                case 'asdaOffers':
                for(var i of body.result.contexts){
                    if(i.name=='mail-set'){
                        mailId=i.parameters.mailId;
                    }
                }
                data[mailId].tab='offers';
                return res.json({
                        speech: "Offers displayed on app",
                        displayText: "Offers displayed on app",
                        source: 'apiai-webhook'
                    });
                break;
            }
        }

        return res.json({
            speech: "Webhook input error",
            displayText: "Webhook input error",
            source: 'apiai-webhook'
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
            item: data[mailId].item.toUpperCase(),
            tab: data[mailId].tab,
            status: 'Success'
        });
        }
        else {
            return res.json({
            mailId: mailId,
            item: null,
            tab: null,
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
