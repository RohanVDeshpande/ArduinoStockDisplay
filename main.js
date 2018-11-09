const fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

http.listen(3000, function() {
   console.log('listening on *:3000');
});

io.on('connection', function(socket) {
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });

   getStock(socket, "TSLA");
   generateGraph(socket, "TSLA");

});

function getStock(socket, ticker){
	request('https://api.iextrading.com/1.0/stock/'+ticker+'/quote', function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	//console.log(html);
	  	var data = JSON.parse(html);
	  	var symbol = data.symbol;
	  	//console.log(symbol);
	  	var currentPrice = data.latestPrice;
	  	//console.log(currentPrice);
	  	var previousClose = data.previousClose;
	  	var delta = currentPrice - previousClose;
	  	var deltaStr = "";
	  	if(delta>0){
	  		deltaStr+="+";
	  	}
	  	else{
	  		deltaStr+="-";
	  	}
	  	deltaStr+=delta.toFixed(2);
	  	//console.log(deltaStr);
	  	socket.emit('stockData',{'symbol':symbol, 'price':currentPrice, 'delta':deltaStr});
	  }
	});
}

function generateGraph(socket, ticker){
	request('https://api.iextrading.com/1.0/stock/'+ticker+'/chart/1d', function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	//console.log(html);
	  	var data = JSON.parse(html);
	  	socket.emit('trend',data);
	  }
	});
}