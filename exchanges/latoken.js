const cloudscraper = require('cloudscraper');
const credentials = require('./../credentials/latoken.json');

const round = (numRaw,decimals=8) => {
	let num = numRaw;
  if (typeof num !== 'number') num = parseFloat(num);
  const multiplier = 10 ** decimals;
  const roundedNumber = Math.round(num * multiplier) / multiplier;
  return Number(roundedNumber);
};


const headerObj = {
  Host: `latoken.com`,
  "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0`,
  Accept: `application/json, text/plain, */*`,
  "Accept-Language": `en-US,en;q=0.9`,
  Referer: `https://exchange.latoken.com/exchange/JSE-ETH`,
  "Content-Type": `application/json;charset=utf-8`,
  Cookie: credentials.cookie,
  Connection: `keep-alive`,
  TE: `Trailers`,
  Pragma: `no-cache`,
  "Cache-Control": `max-age=0, no-cache`,
};

const headerObj2 = {
  authority: 'api.latoken.com',
  method: 'POST',
  path: '/v2/auth/order/place',
  scheme: 'https',
  accept: 'application/json, text/plain, */*',
  "accept-language": `en-US,en;q=0.9`,
  "content-type": `application/json;charset=utf-8`,
  cookie: credentials.cookie,
  origin: 'https://exchange.latoken.com',
  referer: `https://exchange.latoken.com/exchange/JSE-ETH`,
  "sec-fetch-mode": 'cors',
  "sec-fetch-site": 'same-site',
  "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0`,
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

  getLastPrice: async () => {
    const unixTimestamp = Math.round((new Date()).getTime() / 1000);
    const yesterday = unixTimestamp - 86400;
    const options = {
      headers: headerObj,
      json: true,
      method: 'GET',
      uri: `https://api.latoken.com/v2/tradingview/history?symbol=JSE%2FETH&resolution=5&from=${yesterday}&to=${unixTimestamp}`,
    };
    const jseData = await cloudscraper(options);
    const lastPrice = jseData.c[jseData.c.length -1];
    return lastPrice;
  },

  placeOrder: async (myPrice,volume) => {
    const options = {
      headers: headerObj2,
      json: true,
      body: {
        baseCurrency: "JSE",
        condition: "GTC",
        price: String(myPrice),
        quantity: String(volume),
        quoteCurrency: "ETH",
        side: "BUY",
        type: "LIMIT",
      },
      method: 'POST',
      uri: 'https://api.latoken.com/v2/auth/order/place',
    };

    const orderTicket = await cloudscraper(options);
    const returnObj = { price: myPrice, volume };
    if (orderTicket.id) {
      returnObj.success = true;
      returnObj.ref = orderTicket.id;
    } else {
      returnObj.success = false;
      returnObj.error = JSON.stringify(orderTicket);
    }
    return returnObj;
  },

};

module.exports = latoken;
