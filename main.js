const fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var server = app.listen(4000,function(){
	console.log('listening to requests on port 4000');
});

app.use(express.static('public'));

var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
var port = new SerialPort('COM3', {
    baudRate: 9600
});

const parser = port.pipe(new Readline({ delimiter: '\n' }))


port.on("open", function () {
  console.log('open');
  parser.on('data', function(data) {
    console.log(data);
  });
});

function ping(){
	port.write('hi');	
}

app.post('/api/users',function(req, res){
	//console.log(req.body.ticker);
	//console.log(req.body.price);
	res.send("Received");
	port.write(req.body.ticker+"\t"+req.body.price);
});

/*
var fs = require('fs');
var inp = fs.createReadStream("\\\\.\\COM3");
inp.setEncoding('utf8');
var inptext = "0 0";
inp.on('data', function (data) {
  inptext += data;
});*/