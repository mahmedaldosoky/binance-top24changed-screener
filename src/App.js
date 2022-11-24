import "./App.css";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

import { React, useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [topCoins, setTopCoins] = useState([]);

  useEffect(() => {
    getTopChangedCoins();
    // document.onreadystatechange = () => {
    //   simulateClick(32, 32);
    // }
    const comInterval = setInterval(getTopChangedCoins, 1000 * 60 * 5); //This will refresh the data at regularIntervals of refreshTime
    return () => clearInterval(comInterval); //Clear interval on component unmount to avoid memory leak
  }, []);

  async function getTopChangedCoins() {
    var response = await axios.get(
      "https://api.binance.com/api/v1/ticker/24hr"
    );
    var coinsList = response.data;
    var filteredArray = coinsList
      .filter((coin) => coin["symbol"].endsWith("USDT"))
      .filter((coin) => !coin["symbol"].endsWith("UPUSDT"))
      .filter((coin) => !coin["symbol"].endsWith("DOWNUSDT"))
      .filter((coin) => !coin["symbol"].endsWith("NBTUSDT") && !coin["symbol"].endsWith("XECUSDT"));

    filteredArray.sort(function (a, b) {
      return a.priceChangePercent - b.priceChangePercent;
    });

    setTopCoins(filteredArray.reverse());
  }

  const simulateClick = (x, y) => {
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      screenX: x,
      screenY: y,
    });

    const element = document.elementFromPoint(x, y);
    element.dispatchEvent(event);
  };

  return (
    <>
      <div className=" container-fluid p-0 w-100">
        <div className="table-responsive mb-1">
          <table className="table table-dark">


            <>
              <thead>
                <tr>
                  <th scope="col">Symbol</th>
                  {topCoins.slice(0, 12).map((coin, index) => (<th scope="col">{coin["symbol"]}</th>))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Change</th>
                  {topCoins.slice(0, 12).map((coin, index) => (<td style={{ color: "#0ecd82" }}>{coin["priceChangePercent"]}%</td>))}
                </tr>
              </tbody>
            </>
          </table>
        </div>
        <div className=" row p-0 justify-content-around">
          {topCoins.slice(0, 12).map((coin, index) => (
            <div key={index} className="chart col-3 p-0">
              <AdvancedRealTimeChart
                // height="500"
                style={{ width: "100%" }}
                autosize
                // hide_top_toolbar="true"
                hide_legend="true"
                hide_side_toolbar="true"
                interval="15"
                studies={["VWAP@tv-basicstudies"]}
                symbol={coin["symbol"]}
                timezone="Asia/Singapore"
                allow_symbol_change="false"
                theme="dark"
              ></AdvancedRealTimeChart>
            </div>
          ))}
        </div>


      </div>
    </>
  );
};

export default App;
