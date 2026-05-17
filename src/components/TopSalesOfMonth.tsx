import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MonthSalesProps } from '../pages/topMonthSalesService';
import topMonthSalesService from '../pages/topMonthSalesService';

const TopSalesOfMonth = () => {
    const [data, setData] = useState<MonthSalesProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const handleSales = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await topMonthSalesService();
                setData(res);
            } catch (error) {
                if(error instanceof Error){
                    setError(error.message);
                }
            }finally{
                setLoading(false);
            }
        }
        handleSales();
    },[])

    const topProduct = data?.metrics?.[0];
    const maxSalesValue = topProduct ? Number(topProduct.totalSales) : 1;
    const dynamicTargetBaseline = (maxSalesValue) * 0.9;
  return (
    <div>

        {loading && !error && <>
           <div className="w-full animate-pulse">
            <div className="mt-8 bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg">
                
                <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="h-6 w-48 bg-slate-800 rounded-lg"></div>
                    <div className="h-4 w-36 bg-slate-800/60 rounded-md mt-2"></div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-2xl">
                    <TrendingUp className="w-5 h-5 text-slate-700" />
                </div>
                </div>

                <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div
                    key={item}
                    className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4"
                    >
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                        <div className="h-5 w-32 bg-slate-700 rounded-md"></div>
                        <div className="h-4 w-24 bg-slate-700/60 rounded-sm"></div>
                        </div>
                        <div className="h-10 w-14 bg-slate-700/80 rounded-xl"></div>
                    </div>

                    {/* Progress Bar Track Placeholder */}
                    <div className="w-full h-3 bg-slate-700/40 rounded-full mt-4 overflow-hidden">
                        <div 
                        className="h-full bg-slate-700 rounded-full"
                        style={{ width: item === 1 ? '100%' : item === 2 ? '65%' : '35%' }}
                        ></div>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="mt-8 bg-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="h-4 w-28 bg-slate-700 rounded-md"></div>
                <div className="h-8 w-5/6 bg-slate-700 rounded-lg mt-1"></div>
                <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-slate-700/60 rounded-md"></div>
                <div className="h-4 w-11/12 bg-slate-700/60 rounded-md"></div>
                </div>
            </div>
            </div>
        </>}
        {!loading && !error && ( <><div className="mt-8 bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-xl font-bold">
              Top Selling Products
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Best performing products
            </p>
          </div>

          <div className="bg-green-600/20 p-3 rounded-2xl">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="space-y-4">

          {data?.metrics.map((product) => (
            <div
              key={product._id}
              className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4"
            >

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-white">
                    {product.productName}
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    Total Units Sold
                  </p>
                </div>

                <div className="bg-green-500/20 px-4 py-2 rounded-xl">
                  <span className="text-green-400 font-bold">
                    {product.totalSales}
                  </span>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-700 rounded-full mt-4 overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  style={{
                    width: `${(Number(product.totalSales) / dynamicTargetBaseline) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 shadow-xl">

        <p className="text-white/80 text-sm">
          Business Insight
        </p>

        <h2 className="text-3xl font-bold mt-3">
          {topProduct?.productName} is your highest selling product this month.
        </h2>

        <p className="text-white/80 mt-3 leading-7">
          Revenue increased by 12% compared to last month.
          Expenses are under control and profit margins are improving.
        </p>
      </div></>)}
    </div>
  )
}

export default TopSalesOfMonth