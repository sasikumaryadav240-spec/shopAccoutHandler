import React from "react";
import { Package, Search } from "lucide-react";

export const ProductPageSkeleton: React.FC = () => {
  const placeholders = [1, 2, 3];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 pt-3 pb-28 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-4 w-36 bg-slate-800 rounded-md"></div>
          <div className="h-8 w-28 bg-slate-800 rounded-lg mt-2"></div>
        </div>
        <div className="bg-slate-800 p-3 rounded-2xl w-12 h-12"></div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 flex items-center gap-3 mb-6">
        <Search className="w-5 h-5 text-slate-700" />
        <div className="h-4 w-40 bg-slate-800 rounded-md"></div>
      </div>

      <div className="bg-gradient-to-r from-slate-800 to-slate-700/80 rounded-3xl p-5 shadow-xl mb-8 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-slate-700 rounded-md"></div>
            <div className="h-10 w-12 bg-slate-700 rounded-lg"></div>
          </div>
          <div className="bg-slate-700/60 p-4 rounded-3xl w-16 h-16 flex items-center justify-center">
            <Package className="w-8 h-8 text-slate-600" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {placeholders.map((id) => (
          <div
            key={id}
            className="bg-[#111827] border border-slate-800 rounded-[28px] p-5 shadow-lg space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner"></div>

                <div className="space-y-2">
                  <div className="h-5 w-36 bg-slate-800 rounded-md"></div>
                  <div className="h-3 w-20 bg-slate-800/60 rounded-sm"></div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <div className="h-7 w-20 bg-slate-800/80 rounded-2xl"></div>
                <div className="h-5 w-14 bg-slate-800/40 rounded-md"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-11 bg-slate-800/50 border border-slate-700/40 rounded-2xl"></div>
              <div className="h-11 bg-slate-800/40 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPageSkeleton;
