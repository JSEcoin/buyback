/*
	JSE Token Buy Back Trading Bot v0.1.8
	Current Exchanges:
		LATOKEN exchanges/latoken.js
		ECXX exchanges/ecxx.js
*/

const fs = require('fs');
const latoken = require('./exchanges/latoken.js');
const ecxx = require('./exchanges/ecxx.js');

const round = (numRaw,decimals=8) => {
	let num = numRaw;
	if (typeof num !== 'number') num = parseFloat(num);
	const multiplier = 10 ** decimals;
	const roundedNumber = Math.round(num * multiplier) / multiplier;
	return Number(roundedNumber);
};

const log = (logString) => {
	const yymmdd = new Date().toISOString().slice(2,10).replace(/-/g,"");
	console.log(logString);
	fs.appendFile(`logs/${yymmdd}.txt`, logString+"\n", function (err) {});
};

const buyBack = async () => {
	//const latokenData = await latoken.getData();
	const ecxxData = await ecxx.getData();

	/*
	let myPrice = latokenData.midPrice;
	if (latokenData.midPrice >= latokenData.topAsk) myPrice = latokenData.topBid;
	if (latokenData.lastPrice < latokenData.topAsk) myPrice = latokenData.topAsk;
	let volume = round(latokenData.minOrder + (Math.random() * latokenData.minOrder),0);
	if (latokenData.lastPrice < latokenData.prevDayPrice) volume *= 3;
	*/
	const myPrice = await latoken.getLastPrice();
	let volume = Math.round(Math.random() * 1000 + 500);
	console.log(`LATOKEN-ORDER ${volume} JSE @ ${myPrice}ETH`);
	const latokenOrder = await latoken.placeOrder(myPrice,volume);
	log('LATOKEN-TICKET: '+JSON.stringify(latokenOrder));
	if (ecxxData.ethPrice <= parseFloat(myPrice)) {
		const usdPrice = ecxxData.midPrice;
		volume *= 0.5;
		console.log(`ECXX-ORDER ${volume} JSE @ ${ecxxData.ethPrice}ETH`);
		const ecxxOrder = await ecxx.placeOrder(usdPrice,volume);
		log('ECXX-TICKET: '+JSON.stringify(ecxxOrder));
	} else {
		log('ECXX-TICKET: PriceInf '+ecxxData.ethPrice);
	}
};

const loop = () => {
	buyBack();
	const nextInterval = Math.round(Math.random() * 3600000);
	setTimeout(() => { loop(); }, nextInterval);
};

loop();
