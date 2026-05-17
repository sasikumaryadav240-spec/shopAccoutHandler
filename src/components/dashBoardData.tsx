import { DollarSign, LucideWandSparkles, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import type { DashboardDataPayload } from '../services/dashBoardDataService';
import { useEffect, useState } from 'react';
import dashBoardDataService from '../services/dashBoardDataService';

const DashBoardData =  () => {

  const [data, setData] = useState<DashboardDataPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadDashboardMetrics = async () => {
      try {
        setLoading(true);
        setError("");
        
        const result = await dashBoardDataService();
        setData(result);
      } catch (err) {
        if(err instanceof Error){
          setError(err.message || "Could not retrieve store metrics.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardMetrics();
  }, []);
  return (
    <div className="px-4">

      {error && (
        <div className="px-4 bg-slate-500 p-2 rounded-2xl">
          <h1 className='text-red-500 text-2xl font-bold'>{error}</h1>
        </div>
      )}
      {loading && !error && (
        <div className="px-4 bg-slate-500 p-2 rounded-2xl">
          <div className="w-36 h-8 bg-slate-800 rounded-xl animate-pulse mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div 
                key={item} 
                className="bg-[#111827] border border-slate-800/60 rounded-3xl p-5 shadow-lg animate-pulse flex items-center justify-between"
              >
                <div className="flex-1 space-y-3">
                  <div className="w-24 h-3.5 bg-slate-800 rounded-lg" />
                  <div className="w-16 h-7 bg-slate-700 rounded-xl" />
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-2xl shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
        {!loading && !error && <>
         <h1 className="text-2xl font-bold text-white mb-6">
          Dashboard
        </h1>
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-[#172554] border border-blue-900 rounded-3xl p-4 shadow-lg">
            
            <div className="flex items-center justify-between">
              
              <div>
                <p className="text-slate-300 text-sm">
                  Monthly Sales
                </p>

                <h2 className="text-2xl font-bold text-white mt-2">
                  {data?.monthSales.totalSales}
                </h2>
              </div>

              <div className="bg-blue-600 p-3 rounded-2xl">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-[#052E16] border border-green-900 rounded-3xl p-4 shadow-lg">
            
            <div className="flex items-center justify-between">
              
              <div>
                <p className="text-slate-300 text-sm">
                  Total Revenue
                </p>

                <h2 className="text-2xl font-bold text-white mt-2">
                  ₹{data?.monthSales.totalRevenue.toLocaleString()}
                </h2>
              </div>

              <div className="bg-green-600 p-3 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-[#450A0A] border border-red-900 rounded-3xl p-4 shadow-lg">
            
            <div className="flex items-center justify-between">
              
              <div>
                <p className="text-slate-300 text-sm">
                  Expenses
                </p>

                <h2 className="text-2xl font-bold text-white mt-2">
                  ₹{data?.monthExpense.totalAmount.toLocaleString()}
                </h2>
              </div>

              <div className="bg-red-600 p-3 rounded-2xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-[#3B0764] border border-purple-900 rounded-3xl p-4 shadow-lg">
            
            <div className="flex items-center justify-between">
              
              <div>
                <p className="text-slate-300 text-sm">
                  Today's Revenue
                </p>

                <h2 className="text-2xl font-bold text-white mt-2">
                  ₹{data?.dailySales.totalRevenue.toLocaleString()}
                </h2>
              </div>

              <div className="bg-purple-600 p-3 rounded-2xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-orange-600 border border-orange-900 rounded-3xl p-4 shadow-lg">
            
            <div className="flex items-center justify-between">
              
              <div>
                <p className="text-slate-300 text-sm">
                  Today's Sales
                </p>

                <h2 className="text-2xl font-bold text-white mt-2">
                  {data?.dailySales.totalSales}
                </h2>
              </div>

              <div className="bg-orange-800 p-3 rounded-2xl">
                <LucideWandSparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        </>}
      </div>
  )
}

export default DashBoardData