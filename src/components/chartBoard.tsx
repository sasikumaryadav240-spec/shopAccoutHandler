import { BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import type { yearProps } from '../services/chartBoardService';
import chartBoardService from '../services/chartBoardService';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ChartBoard = () => {
    const [data, setData] = useState<yearProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const handleYear = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await chartBoardService();
                setData(res);
            } catch (error) {
                if(error instanceof Error){
                    setError(error.message);
                }
            }finally{
                setLoading(false);
            }
        }
        handleYear();
    },[]);
  
  const formattedData = data?.yearMetrics?.map(item => {
    const monthLabel = MONTH_NAMES[item.month - 1] || `M${item.month}`;
    const shortYear = String(item.year).slice(-2);

    return {
      name: `${monthLabel} '${shortYear}`,
      revenue: item.totalRevenue,
      sales: item.noOfSales
    };
  }) || [];

  return (
    <div className="mt-8 bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg">
        {loading && !error && <div className="mt-8 bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-lg w-full animate-pulse">
      
        <div className="flex items-center justify-between mb-6">
            <div>
            <div className="h-6 w-40 bg-slate-800 rounded-lg"></div>
            <div className="h-4 w-52 bg-slate-800/60 rounded-md mt-2"></div>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-2xl">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            </div>
        </div>

        <div className="h-[250px] bg-[#1E293B] rounded-3xl border border-slate-700 p-6 flex flex-col justify-between">
            
            <div className="flex-1 flex items-end justify-between gap-2 border-b border-slate-700/60 pb-2 h-44">
            {[20, 35, 15, 45, 30, 25, 60, 40, 55, 10, 70, 85].map((heightValue, index) => (
                <div 
                key={index} 
                className="flex-1 max-w-[32px] bg-slate-700/50 rounded-t-lg transition-all duration-300"
                style={{ 
                    height: `${heightValue}%`,
                    opacity: index === 11 ? 0.8 : 0.4 
                }}
                ></div>
            ))}
            </div>

            <div className="flex justify-between items-center pt-3 px-1">
            {[1, 2, 3, 4, 5, 6].map((label) => (
                <div 
                key={label} 
                className="h-3 w-10 bg-slate-700/60 rounded"
                ></div>
            ))}
            </div>

        </div>
        </div>}
      {!loading && !error && <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            Monthly Revenue
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Revenue performance overview
          </p>
        </div>
        <div className="bg-blue-600/20 p-3 rounded-2xl">
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
      </div>

      <div className="h-[250px] bg-[#1E293B] rounded-3xl border border-slate-700 p-4">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-5}
              />
              
              <Tooltip 
                cursor={{ fill: '#334155', opacity: 0.3 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl">
                        <p className="text-slate-400 text-xs font-semibold mb-1">{payload[0].payload.name}</p>
                        <p className="text-blue-400 font-bold text-sm">
                          Revenue: ₹{payload[0].value}
                        </p>
                        <p className="text-slate-300 text-xs mt-0.5">
                          Orders: {payload[0].payload.sales} units
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Bar 
                dataKey="revenue" 
                fill="#3b82f6" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <BarChart3 className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No historical revenue metrics found</p>
            </div>
          </div>
        )}
      </div></>}
    </div>
  );
};

export default ChartBoard;
