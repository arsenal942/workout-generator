const express = require('express'),
    app = express(),
    port = 8080,
    path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log('Web Server listening on port: ' + port));