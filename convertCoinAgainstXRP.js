const fileName = "LINK-XRP.json";
const subjectCoin = require("./linkusd.json").data.ohlc;

// don't change anything below this line
const xrpusd = require("./xrpusd.json").data.ohlc;

function timestampToKey(rawData) {
  return rawData.reduce((prev, cur, idx, arr) => {
    return [
      ...prev,
      {
        [cur.timestamp]: {
          low: parseFloat(cur.low),
          open: parseFloat(cur.open),
          close: parseFloat(cur.close),
          high: parseFloat(cur.high),
        },
      },
    ];
  }, []);
}

const xrpusdData = timestampToKey(xrpusd);
const subjectCoinData = timestampToKey(subjectCoin);

// loop subjectCoinData and find the corresponding timestamp in xrpusdData
// if found, divide subjectCoin against xrpusd and save into new array

const subjectCoinAgainstXRP = subjectCoinData.reduce((prev, cur, idx, arr) => {
  const timestamp = Object.keys(cur)[0];
  const coin = Object.values(cur)[0];
  const xrp = xrpusdData.find((x) => {
    return Object.keys(x)[0] === timestamp;
  });

  if (xrp) {
    const xrpValue = Object.values(xrp)[0];
    const subjectCoinAgainstXRPValue = {
      timestamp: timestamp,
      low: coin.low / xrpValue.low,
      open: coin.open / xrpValue.open,
      close: coin.close / xrpValue.close,
      high: coin.high / xrpValue.high,
    };

    return [...prev, subjectCoinAgainstXRPValue];
  }

  return prev;
}, []);

const fs = require("fs");
fs.writeFileSync(fileName, JSON.stringify(subjectCoinAgainstXRP));
