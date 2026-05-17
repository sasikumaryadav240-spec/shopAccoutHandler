import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import type { topsales } from "../services/topsalesService";
import topsalesService from "../services/topsalesService";

const TopSalesOfDay = () => {
  const [data, setData] = useState<topsales>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleTopSalesData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await topsalesService();
        setData(res);
      } catch (error) {
        if(error instanceof Error){
          setError(error.message);
        }else{
          setError("An UnExpected Error Occured")
        }
      }finally{
        setLoading(false);
      }
    }

    handleTopSalesData();
  },[])
  return (
    <div className="mt-8 px-4">

      {error && !loading && <div className="w-full px-4 py-3 rounded-lg m-2 bg-gray-400">
        <div className="text-red-400 text-md font-bold">
          {error}
        </div>
        </div>}
      {loading && !error && (
          <div className="px-4 animate-pulse">
            <div className="space-y-3 mb-6">
              <div className="w-48 h-6 bg-slate-800 rounded-lg" />
              <div className="w-32 h-4 bg-slate-800/60 rounded-md" />
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-4 space-y-3">
              <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-800/60">
                <div className="w-24 h-3 bg-slate-800 rounded" />
                <div className="w-12 h-3 bg-slate-800 rounded" />
                <div className="w-16 h-3 bg-slate-800 rounded" />
              </div>

              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div 
                  key={item} 
                  className="w-full bg-slate-900/40 border border-slate-800/40 px-5 py-4 rounded-2xl flex flex-row justify-between items-center transition-all duration-300"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-slate-800 w-10 h-10 rounded-xl shrink-0" /> {/* Product Icon Mask */}
                    <div className="space-y-2 w-1/2">
                      <div className="w-full h-3.5 bg-slate-700 rounded-md" /> {/* Product Name Line */}
                      <div className="w-2/3 h-2.5 bg-slate-800 rounded-md" />  {/* Extra Info Tag Line */}
                    </div>
                  </div>
                  <div className="w-16 flex justify-center">
                    <div className="w-8 h-5 bg-slate-800 rounded-lg" />
                  </div>
                  <div className="w-24 flex justify-end">
                    <div className="w-16 h-5 bg-slate-800/80 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && !error && <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Top Sales Today
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Most sold products today
              </p>
            </div>

            <div className="bg-blue-600/20 px-3 py-1 rounded-xl">
              <span className="text-blue-400 text-sm font-medium">
                Today
              </span>
            </div>
          </div>
          {data?.metrics.map((product) => (
            <ul key={product._id} className="space-y-4">
            <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 flex items-center justify-between mb-2">
              
              <div className="flex items-center gap-3">
                
                <div className="bg-orange-500/20 p-3 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-orange-400" />
                </div>

                <div>
                  <h3 className="text-white font-semibold">
                    {product.productName}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Total sold
                  </p>
                </div>
              </div>

              <div className="bg-green-500/20 px-4 py-2 rounded-xl">
                <span className="text-green-400 font-bold">
                  {product.noOfSales}
                </span>
              </div>
            </div>
            </ul>
          ))}
        </div>}
      </div>
  )
}

export default TopSalesOfDay