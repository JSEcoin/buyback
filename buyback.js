/*
	JSE Token Buy Back Trading Bot v0.1.8
	Current Exchanges:
		LATOKEN exchanges/latoken.js
		ECXX exchanges/ecxx.js
*/

const fs = require('fs');
const latoken = require('./exchanges/latoken.js');
const ecxx = require('./exchanges/ecxx.js');

const round = (num,decimals=8) => {
	if (typeof num !== 'number') num = parseFloat(num);
	const multiplier = 10 ** decimals;
	const roundedNumber = Math.round(num * multiplier) / multiplier;
	return Number(roundedNumber);
};

const log = (logString) => {
	const yymmdd = new Date().toISOString().slice(2,10).replace(/-/g,"");
	console.log(logString);
	fs.appendFile(`logs/${yymmdd}.txt`, logString+"\n", function (err) {});
}

const buyBack = async () => {
	const latokenData = await latoken.getData();
	const ecxxData = await ecxx.getData();

	let myPrice = latokenData.midPrice;
	if (latokenData.midPrice >= latokenData.topAsk) myPrice = latokenData.topBid;
	if (latokenData.lastPrice < latokenData.topAsk) myPrice = latokenData.topAsk;
	let volume = round(latokenData.minOrder + (Math.random() * latokenData.minOrder),0);
	if (latokenData.lastPrice < latokenData.prevDayPrice) volume *= 3;

	const latokenOrder = await latoken.placeOrder(myPrice,volume);
	log('LATOKEN: '+JSON.stringify(latokenOrder));

	if (ecxxData.ethPrice <= latokenData.midPrice * 1.05) {
		let usdPrice = ecxxData.midPrice;
		volume = volume * 0.5;
		const ecxxOrder = await ecxx.placeOrder(usdPrice,volume);
		log('ECXX: '+JSON.stringify(ecxxOrder));
	} else {
		log('ECXX: PriceInf '+ecxxData.ethPrice);
	}

}

const loop = () => {
	buyBack();
	const nextInterval = Math.round(Math.random() * 3600000);
	setTimeout(() => { loop(); }, nextInterval);
};

loop();
