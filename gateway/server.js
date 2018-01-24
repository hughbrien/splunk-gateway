const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');


const app = express();

app.use((req, res, next) => {
    res.set('Timing-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// Due to Instana setting the wrong content-type force to string body
app.use(bodyParser.text({type: '*/*'}));

app.get('/health', (req, res) => {
    res.send('OK');
});

// Gateway endpoint. Instana calls here
app.post('/gateway', (req, res) => {
    console.log('gateway called');

    // parse to JSON here
    var data;
    try {
        data = JSON.parse(req.body);
    } catch(e) {
        console.error('JSON parse error', e);
        res.status(500).send(e);
        return;
    }

    // wrap it
    var evt = {
        event: data,
        sourcetype: 'instana'
    };
    if(config.debug) {
        console.log('content type', req.get('Content-Type'));
        console.log('event', JSON.stringify(evt, null, 4));
    }

    // forward to splunk
    request({
        method: 'POST',
        url: config.splunkUrl,
        json: evt,
        timeout: 5000,
        auth: {
            user: 'user', // splunk only checks the key
            pass: config.splunkKey
        }
    }, (error, resp, body) => {
        if(!error && resp.statusCode == 200) {
            console.log('event forward OK');
            res.send('OK');
        } else {
            var code = resp == undefined ? 500 : resp.statusCode;
            console.error(error, code);
            res.status(code).send(error);
        }
    });
});


// Configuration pulled from ENV
const config = {
    splunkUrl: process.env.GATEWAY_SPLUNK_URL,
    splunkKey: process.env.GATEWAY_SPLUNK_KEY,
    debug: process.env.GATEWAY_DEBUG || false
};
// make sure all the info is there
var missing = false;
for(var key in config) {
    if(config[key] === undefined) {
        console.error('Missing config', key);
        missing = true;
    }
}
if(missing) {
    process.exit(1);
}

// fire it up!
const port = process.env.GATEWAY_SERVER_PORT || '8080';
app.listen(port, () => {
    console.log('Started on port', port);
});
