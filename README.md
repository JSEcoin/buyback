# buyback

## JSE Token Buy Back Trading Bot

Node.js crypto exchange trading bot. Uses cloudscraper to complete cloudflare authentication where no API is available.

- Current Exchanges:
- LATOKEN exchanges/latoken.js
- ECXX exchanges/ecxx.js

Our aim is to stabilize and gradually increase the token value against ETH/USD pairs.

Methodology:

1. Bot operates at a random interval between 0 and 60 mins.
2. Market data is extracted from exchanges.
3. Bid price calculated adding liquidity to exchange.
4. Limit order placed.

JSE tokens purchased on exchange are withdrawn back to the distribution account.

The code base is modular so more exchanges can be added in the future and any users wishing to use the code for their own purchases or market making should be able to modify it with relative ease.

## Installation

Package can be installed with:-

```
git clone https://github.com/jsecoin/buyback.git;
cd buyback;
mkdir logs;
mkdir credentials;
npm install;
node buyback.js;
```

Credentials are stored in credentials/latoken.json and credentials/ecxx.json respectively. LATOKEN contains the browser cookie data post-login and ECXX contains an apiKey available from their support team.


ecxx.json is just
```
{
  "apiKey": ""
}
```

and latoken.json is
```
{
  "cookie": ""
}
```
To get the cookie string use a web browser to log in to your latoken account. Then open a browser console (firefox is ctrl+shift+k, for chrome it's ctrl+shift+j)

Then go to network, look for an ajax request to one of the api endpoints. Just copy the entire Cookie string from the request header. It'll start something like:
_cfduid=dd35ffffff13d7fffffff8; uaid=18c02c2782665fffff980dc9c; ajs_user_id=12345; ....

You might be able to get it just by running document.cookie; in the console as well.



Note. Use forever or equivalent to run as a background process
```
forever start buyback.js
```
*For more information on the JSEcoin project visit [JSEcoin](https://jsecoin.com/).*

*Developer portal: [https://developer.jsecoin.com](https://developer.jsecoin.com)*