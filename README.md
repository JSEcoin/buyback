# buyback

## JSE Token Buy Back Trading Bot

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
npm install;
node buyback.js;
```

Note. Use forever or equivalent to run as a background process


*For more information on the JSEcoin project visit [JSEcoin](https://jsecoin.com/).*

*Developer portal: [https://developer.jsecoin.com](https://developer.jsecoin.com)*