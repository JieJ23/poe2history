import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { defineColor } from "./Misc";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [objectData, setObjectData] = useState(null);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(null);

  const handleParse = () => {
    try {
      const obj = JSON.parse(inputValue);
      setObjectData(obj);
      localStorage.setItem("myHistory", JSON.stringify(inputValue));
      setError(null);
    } catch (err) {
      setObjectData(null);
      setError("Invalid JSON!");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("myHistory");
    if (stored) {
      setInputValue(JSON.parse(stored));
    }
  }, []);

  const soldHistory = objectData?.result;
  const sold_currency = [...new Set(soldHistory?.map((obj) => obj.price.currency))];
  const sold_date = [...new Set(soldHistory?.map((obj) => obj.time.slice(0, 10)))].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const store_day_count = [];
  const store = [];

  for (let i = 0; i < sold_currency.length; i++) {
    const currencyArray = soldHistory.filter((obj) => obj.price.currency === sold_currency[i]);
    store.push(currencyArray);
  }

  for (let i = 0; i < sold_date.length; i++) {
    let dayStore = {};
    const currencyArray = soldHistory.filter((obj) => obj.time.slice(0, 10) == sold_date[i]);
    const allCurrencyType = [...new Set(currencyArray.map((obj) => obj.price.currency))];
    dayStore.dat = sold_date[i];

    for (let x = 0; x < allCurrencyType.length; x++) {
      const totalCurrency = currencyArray.reduce((acc, val) => acc + val.price.amount, 0);
      dayStore[allCurrencyType[x]] = totalCurrency;
    }
    store_day_count.push(dayStore);
  }

  const displayHistory =
    current !== null ? soldHistory.filter((obj) => obj.price.currency === sold_currency[current]) : soldHistory;

  return (
    <main className="overflow-hidden font-[Fontin] text-[12px] md:text-[14px]">
      <div className="w-full max-w-[1400px] mx-auto my-2 px-2">
        <button className="mb-2 btn btn-sm px-2 font-normal bg-white rounded text-black p-0" onClick={handleParse}>
          Parse JSON
        </button>
        <div className="p-2 bg-[#393940] text-white rounded">
          <div>- Log into POE 2 trade website</div>
          <div className="flex flex-wrap gap-1">
            <div>- Once logged-in, you can access your history JSON:</div>
            <div className="text-[#00ffaa]">
              https://www.pathofexile.com/api/trade2/history/Rise%20of%20the%20Abyssal
            </div>
          </div>
          <div>- Copy everything (Ctrl A and Ctrl C) and paste (Ctrl V) onto the textarea below.</div>
          <div>- Parse JSON button above.</div>
        </div>
        <textarea
          value={inputValue}
          className="textarea h-[200px] w-[95%] mx-auto my-2"
          placeholder="Bio"
          onChange={(e) => setInputValue(e.target.value)}
        />
        {error && <div className="text-[red]">{error}</div>}
        {objectData !== null && (
          <>
            <div className="px-2 mt-4 my-2 text-[14px]">Currency Transactions by Date.</div>

            <div className="h-[400px] mb-4 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={store_day_count}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid stroke="#ffffff20" strokeDasharray="" vertical={false} />
                  <XAxis dataKey="dat" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000", // dark background
                      border: "0px solid #000",
                      borderRadius: "rounded",
                      color: "#ffffff", // text color (doesn't always work, use labelStyle too)
                    }}
                    labelStyle={{ color: "#fff" }} // controls the label text color
                  />

                  <Bar dataKey="transmute" stackId="a" fill="#A8DADC" />
                  <Bar dataKey="aug" stackId="a" fill="#83C5BE" />
                  <Bar dataKey="regal" stackId="a" fill="#B0BEC5" />
                  <Bar dataKey="alch" stackId="a" fill="#64B5F6" />
                  <Bar dataKey="exalted" stackId="a" fill="#42A5F5" />
                  <Bar dataKey="chaos" stackId="a" fill="#FFEB3B" />
                  <Bar dataKey="annul" stackId="a" fill="#FFA726" />
                  <Bar dataKey="divine" stackId="a" fill="#EF5350" />
                  <Bar dataKey="mirror" stackId="a" fill="#D32F2F" />
                  <Bar dataKey="vaal" stackId="a" fill="#81C784" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
        {objectData !== null && (
          <div>
            <div className="px-2 mt-4 my-2 text-[14px]">Transactions Summary per Currency.</div>
            <div className="flex flex-wrap  md:justify-start justify-center gap-2">
              {sold_currency.map((ite, index) => (
                <div className="bg-[#131111] px-4 py-2 rounded min-w-[100px] relative" key={index}>
                  <div
                    className="absolute top-2 right-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: defineColor(ite) }}
                  />
                  <div
                    className="absolute top-2 right-2 h-3 w-3 rounded-full animate-ping"
                    style={{ backgroundColor: defineColor(ite) }}
                  />
                  <div>
                    <img src={`/${ite}.png`} alt="Currency" className="size-8 mx-auto" />
                  </div>
                  <div>Transaction: {store[index].length}</div>
                  <div>Total: {store[index].reduce((acc, val) => acc + val.price.amount, 0)}x</div>
                </div>
              ))}
            </div>
            <div className="px-2 mt-4 my-2 text-[14px]">Sort transactions based on currency.</div>
            <div className="flex flex-wrap gap-1 my-2">
              <div
                className={`text-white px-1 py-0.5 rounded cursor-pointer min-w-[100px] text-center ${
                  current === null ? `bg-[#131111]` : `bg-[#393940] `
                }`}
                onClick={() => {
                  setCurrent(null);
                }}
              >
                All
              </div>
              {sold_currency.map((item, index) => (
                <div
                  className={`flex text-white items-center gap-2 justify-center px-1 py-0.5 rounded cursor-pointer min-w-[100px] text-center text-[12px] ${
                    index === current ? `bg-[#131111]` : `bg-[#393940]`
                  }`}
                  onClick={() => {
                    setCurrent(index);
                  }}
                >
                  <div>{item}</div>
                  <img src={`${item}.png`} alt="Currency" className="size-6" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2 gap-2">
              {displayHistory.map((arr, index) => (
                <div className="grid grid-cols-3 gap-4 bg-[#131111] px-2 py-1 rounded" key={index}>
                  <div>{arr.time.slice(0, 10)}</div>
                  <div className="text-end">{arr.price.amount}x</div>
                  <div className="flex items-center gap-2 justify-end">
                    <div>{arr.price.currency}</div>
                    <img src={`/${arr.price.currency}.png`} alt="Currency" className="size-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
