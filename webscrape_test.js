//https://iextrading.com/developer/docs/#quote

var request = require('request');
var cheerio = require('cheerio');

getStock("TSLA");
getStock("GOOGL");

function getStock(ticker){
	request('https://api.iextrading.com/1.0/stock/'+ticker+'/quote', function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	//console.log(html);
	  	var data = JSON.parse(html);
	  	var symbol = data.symbol;
	  	console.log(symbol);
	  	var currentPrice = data.latestPrice;
	  	console.log(currentPrice);
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
	  	console.log(deltaStr);
	  }
	});
}

function generateGraph(ticker){
	request('https://api.iextrading.com/1.0/stock/'+ticker+'/chart/1d', function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	console.log(html);
	  }
	});
}