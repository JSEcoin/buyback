const cloudscraper = require('cloudscraper');
const credentials = require('./../credentials/latoken.json');

const round = (num,decimals=8) => {
  if (typeof num !== 'number') num = parseFloat(num);
  const multiplier = 10 ** decimals;
  const roundedNumber = Math.round(num * multiplier) / multiplier;
  return Number(roundedNumber);
};

const headerObj = {
  "Host": `latoken.com`,
  "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0`,
  "Accept": `application/json, text/plain, */*`,
  "Accept-Language": `en-GB,en-US;q=0.7,en;q=0.3`,
  "Referer": `https://latoken.com/exchange/ETH-JSE`,
  "Content-Type": `application/json;charset=utf-8`,
  "Cookie": credentials.cookie,
  "Connection": `keep-alive`,
  "TE": `Trailers`,
  "Pragma": `no-cache`,
  "Cache-Control": `max-age=0, no-cache`,
}

const latoken = {

  getData: async () => {
    const options = {
      headers: headerObj,
      json: true,
      method: 'GET',
      uri: 'https://latoken.com/api/assets/564',
    };
    const jseData = await cloudscraper(options);
    const returnObj = {};
    const buyOrders = jseData.buyOrders;
    const sellOrders = jseData.sellOrders;
    returnObj.minOrder = jseData.minTokensInOrder;
    returnObj.topBid = buyOrders[0].price;
    returnObj.topAsk = sellOrders[0].price;
    returnObj.midPrice = round((returnObj.topBid + returnObj.topAsk) / 2,7);
    returnObj.lastPrice = jseData.lastPrice;
    returnObj.prevDayPrice = jseData.prevDayPrice;
    return returnObj;
  },

  placeOrder: async (myPrice,volume) => {
    const options = {
      headers: headerObj,
      json: true,
      body: {
        amount: volume,
        pairId: 564,
        price: myPrice,  
        side: 'buy',
      },
      method: 'POST',
      uri: 'https://latoken.com/api/v2/order',
    };
    const orderTicket = await cloudscraper(options);
    const returnObj = { price: myPrice, volume };
    if (orderTicket.orderId) {
      returnObj.success = true;
      returnObj.ref = orderTicket.orderId;
    } else {
      returnObj.success = false;
      returnObj.error = JSON.stringify(orderTicket);
    }
    return returnObj;
  },

};

module.exports = latoken;
