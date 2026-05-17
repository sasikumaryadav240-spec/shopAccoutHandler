import { useEffect, useState } from "react";
import type { monthlyProps } from "../services/monthlyService";
import monthlyService from "../services/monthlyService";

const MonthlyHistory = () => {

  const [data, setData] = useState<monthlyProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleMonth = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await monthlyService();
        setData(res);
      } catch (error) {
        if(error instanceof Error){
          setError(error.message);
        }else{
          setError("An Unexpected Error");
        }
      }finally{
        setLoading(false);
      }
    }
    handleMonth();
  },[])
  return (
    <div className="px-4 mt-6 flex flex-col gap-2">
      {loading && !error && <>
      {[1,2,3,4,5].map(() => (
        <div className="w-full bg-slate-500 border border-slate-800 rounded-[32px] p-5 shadow-xl flex flex-col justify-between gap-2">
            <div className="flex items-start justify-between mt-1 mb-1">

              <div className="flex flex-col gap-3 mt-2">
                <p className="h-5 w-10 bg-slate-700 rounded-lg"></p>

                <h2 className="h-6 w-15 bg-slate-700 rounded-lg">
                </h2>
              </div>

              <div className="h-8 w-15 bg-slate-700 rounded-3xl">
                
              </div>
            </div>
            <div className="h-9 w-full bg-slate-700 rounded-3xl">
              
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">

              <div className="h-8 bg-slate-700 rounded-3xl">
                
              </div>
              <div className="h-8 bg-slate-700 rounded-3xl">
              </div>
            </div>
            <div className={"h-10 bg-slate-700 w-full rounded-3xl"}>
            </div>
          </div>
      ))}
      </>}

      {!loading && !error && data && (
      <div className="flex flex-col gap-4">
      {data?.combinedHistory.map((month) => {
        const netProfilt = month.totalRevenue - month.totalExpense;
        const isProfitable = netProfilt >= 0;
        return (
          <ul key={`${month.year}-${month.month}`}>
          <div className="w-full bg-[#7C2D12] border border-orange-800 rounded-[32px] p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-orange-200 text-sm">
                  Month
                </p>

                <h2 className="text-xl font-bold text-white mt-1">
                  {String(month.month).padStart(2, '0')} - {month.year}
                </h2>
              </div>

              <div className="bg-orange-500/20 px-4 py-2 rounded-2xl border border-orange-700">
                <p className="text-orange-300 text-sm font-semibold">
                  Monthly Report
                </p>
              </div>
            </div>
            <div className="flex justify-center bg-[#9A3412] rounded-3xl p-2 border border-orange-700 shadow-md mt-2">
              <p className="text-orange-200 text-sm font-bold">
                Total Sales - {month.noOfSales.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">

              <div className="flex justify-center bg-green-900 rounded-3xl p-2 border border-orange-700 shadow-md">
                <p className="text-green-200 text-sm font-bold">
                  Revenue - ₹{month.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-center bg-[#450A0A] rounded-3xl p-2 border border-orange-700 shadow-md">
                <p className="text-red-200 text-sm font-bold">
                  Expense - ₹{month.totalExpense.toLocaleString()}
                </p>
              </div>
            </div>
            <div className={`flex justify-center items-center ${isProfitable ? "bg-gradient-to-r from-green-600 to-emerald-500" : "bg-gradient-to-r from-red-600 to-pink-700"} rounded-3xl p-5 shadow-lg mt-2`}>

              <p className="text-white text-md font-bold">
                Net {isProfitable ? "Profit" : "loss"} - ₹{netProfilt}
              </p>
            </div>
          </div>
        </ul>
        );
      })}
      </div>)}
    </div>
  );
};

export default MonthlyHistory;