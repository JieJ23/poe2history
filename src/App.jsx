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
    <main className="overflow-hidden font-[Fontin] text-[12px] relative">
      <div className="fixed w-full h-lvh -z-10 pointer-events-none">
        <div className="w-full h-full bg-[url('/poe2.webp')] bg-top bg-cover" />
      </div>
      <div className="w-full max-w-[1400px] mx-auto my-2 px-2">
        <button className="mb-2 btn btn-sm px-2 font-normal bg-white rounded text-black p-0" onClick={handleParse}>
          Parse JSON
        </button>
        <div className="p-2 text-white rounded">
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

                  <Bar dataKey="hinekoras-lock" stackId="a" fill="#F44336" />
                  <Bar dataKey="chance" stackId="a" fill="#8E24AA" />
                  <Bar dataKey="fracturing-orb" stackId="a" fill="#FFC107" />
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
            <div className="grid grid-cols-3 sd:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-1">
              {sold_currency.map((ite, index) => (
                <div className="bg-[black] p-2 rounded border-1 border-white/20 relative" key={index}>
                  <div
                    className="absolute top-2 right-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: defineColor(ite) }}
                  />
                  <div
                    className="absolute top-2 right-2 h-3 w-3 rounded-full animate-ping"
                    style={{ backgroundColor: defineColor(ite) }}
                  />
                  <div>
                    <img src={`/${ite}.png`} alt="Currency" className="size-8" />
                  </div>
                  <div>Transaction: {store[index].length}</div>
                  <div>Total: {store[index].reduce((acc, val) => acc + val.price.amount, 0)}x</div>
                  <div className="text-[10px] text-end text-gray-400">{ite}</div>
                </div>
              ))}
            </div>
            <div className="px-2 mt-4 my-2 text-[14px]">Sort transactions based on currency.</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1 my-2">
              <div
                className={`text-white  px-1 py-0.5 rounded cursor-pointer flex items-center justify-center ${
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
                  className={`flex text-white items-center justify-center gap-2 p-1 rounded cursor-pointer text-center text-[12px] ${
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
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 mb-4 mt-2 gap-1">
              {displayHistory.map((arr, index) => (
                <div className="border-1 border-white/20 p-2 rounded bg-[black] relative" key={index}>
                  <div className={`flex flex-col justify-center items-center`}>
                    <div className="">{arr.price.amount}x</div>
                    <img src={`/${arr.price.currency}.png`} alt="Currency" className="size-8 mx-auto" />
                    <div className="text-[12px]">{arr.price.currency}</div>
                    <div className="text-[12px]">{arr.time.slice(0, 10)}</div>
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
