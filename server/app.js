const express = require('express');
const fs = require('fs');
const app = express();
var lineCounter = 0;
var fileCounter = 0;
currentName = 'log.csv';


app.use((req, res, next) => {

var array = [req.headers['user-agent'].replace(/,/g, ''),
            new Date().toISOString(),
            req.method,
            req.url,
            'HTTP/' + req.httpVersion,
            'Status: 200',
            ];

var data = array.toString();

console.log(data);

fs.appendFile('log.csv', data +'\n' ,function(err){
    if (err) throw err;
    
    lineCounter ++;
    if (lineCounter===20){
        console.log('Reached 20');
        lineCounter = 0; 
        fileCounter++;                                       // reset lineCounter to 0
        newName = 'log' + fileCounter + '.csv';
        fs.rename(currentName, newName, function (err) {
            console.log('rename callback ', err); 
            fs.appendFile(currentName, 'Agent,Time,Method,Resource,Version,Status' +'/n' ,function(err){
                if (err) throw err;})
            //currentName = newName;
            console.log(fileCounter);
            console.log(currentName);
        });

    }

} );
next()
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send("OK");
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    fs.readFile('./log.csv', 'utf8', function(err, data){
    objectArray = [];
    var logLines = data.split('\n');

   for (let i = 1; i < logLines.length-1; i++){
        var splitData = logLines[i].split(',');
        var object = {
            Agent:splitData[0],
            Time:splitData[1],
            Method:splitData[2],
            Resource:splitData[3],
            Version:splitData[4],
            Status:splitData[5],
        };

        objectArray.push(object);
    
                           }

    res.status(200).send(objectArray);
    }   )

});

module.exports = app;
