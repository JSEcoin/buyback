const cloudscraper = require('cloudscraper');
const md5 = require('blueimp-md5');
const credentials = require('./../credentials/ecxx.json');

const round = (num,decimals=8) => {
  if (typeof num !== 'number') num = parseFloat(num);
  const multiplier = 10 ** decimals;
  const roundedNumber = Math.round(num * multiplier) / multiplier;
  return Number(roundedNumber);
};

const marketPair = 'JSE_USDT';

const ecxx = {

  getData: async () => {
    const options = {
      json: true,
      method: 'POST',
      uri: 'https://www.ecxx.com/exapi/api/klinevtwo/message',
    };
    const jseData = await cloudscraper(options);
    const returnObj = {};
    const buyOrders = jseData.marketDetail[marketPair][0].payload.bids;
    const sellOrders = jseData.marketDetail[marketPair][0].payload.asks;
    returnObj.minOrder = 100;
    returnObj.topBid = buyOrders.price[0];
    returnObj.topAsk = sellOrders.price[0];
    returnObj.midPrice = round((returnObj.topBid + returnObj.topAsk) / 2,7);
    returnObj.lastPrice = jseData.marketDetail[marketPair][0].payload.priceLast;
    returnObj.prevDayPrice = jseData.marketDetail[marketPair][0].payload.yesterdayPriceLast;
    returnObj.ethUSD = jseData.marketDetail['ETH_USDT'][0].payload.bids.price[0];
    returnObj.ethPrice = returnObj.midPrice / returnObj.ethUSD;
    
    return returnObj;
  },

  placeOrder: async (myPrice,volume) => {
    const options = {
      json: true,
      form: {
        entrustPrice: String(myPrice),  
        type: 1,//'buy',
        coinCode: marketPair,
        entrustCount: String(volume),
      },
      method: 'POST',
      uri: 'https://www.ecxx.com/exapi/api/trade/order',
    };  

    const stringToSign = String(options.form.entrustPrice + options.form.type + options.form.coinCode + options.form.entrustCount);
    options.form.sign1 = md5(stringToSign,credentials.apiKey);
    options.form.accesskey = credentials.apiKey;

    const orderTicket = await cloudscraper(options);
    const returnObj = { price: myPrice, volume };
    if (orderTicket.success && orderTicket.success === true && orderTicket.obj) {
      returnObj.success = true;
      returnObj.ref = orderTicket.obj;
    } else {
      returnObj.success = false;
      returnObj.error = JSON.stringify(orderTicket);
    }
    return returnObj;
  },

};

module.exports = ecxx;
