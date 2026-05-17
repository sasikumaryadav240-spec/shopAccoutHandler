import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Calendar, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Layers, FileText, Box, ArrowLeft } from 'lucide-react';
import { getTimelineService, type TimelineItem } from '../services/AllTimeHistoryService';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const TimelineHistory: React.FC = () => {
  const [allRecords, setAllRecords] = useState<TimelineItem[]>([]);
  const [visibleRecords, setVisibleRecords] = useState<TimelineItem[]>([]);
  const [displayLimit, setDisplayLimit] = useState<number>(ITEMS_PER_PAGE);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const navigation = useNavigate();

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoading(true);
        const data = await getTimelineService();
        const timelineList = data.timeline || [];
        
        setAllRecords(timelineList);
        setVisibleRecords(timelineList.slice(0, ITEMS_PER_PAGE));
        
        if (timelineList.length <= ITEMS_PER_PAGE) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Timeline catch error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMasterData();
  }, []);

  const loadNextBatch = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    setTimeout(() => {
      const nextLimit = displayLimit + ITEMS_PER_PAGE;
      const nextBatchSlice = allRecords.slice(0, nextLimit);
      
      setVisibleRecords(nextBatchSlice);
      setDisplayLimit(nextLimit);
      
      if (nextBatchSlice.length >= allRecords.length) {
        setHasMore(false);
      }
      setLoadingMore(false);
    }, 600);
  }, [displayLimit, allRecords, loadingMore, hasMore]);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadNextBatch();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(currentTarget);
    
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [observerTarget, loadNextBatch, hasMore, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        <p className="animate-pulse text-slate-400 text-sm font-medium">Assembling chronological cash timeline ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 pt-4 pb-24 flex flex-col items-center">

      <div className="w-full max-w-2xl mb-6 text-left">
        <button
          onClick={() => navigation(-1)}
          className="p-2.5 bg-[#111827] border border-slate-800 mb-3 hover:border-slate-700 hover:bg-slate-800/60 text-slate-400 hover:text-white rounded-xl transition-all shadow-md active:scale-95 group"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Store Activity Stream</p>
        <h1 className="text-2xl font-black mt-0.5 text-white">All-Time History Ledger</h1>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {visibleRecords.length === 0 ? (
          <div className="text-center py-20 bg-[#111827] border border-slate-800 rounded-3xl">
            <Box className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No transaction ledger records recorded on this account profile.</p>
          </div>
        ) : (
          visibleRecords.map((item) => (
            <div 
              key={item._id}
              className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex flex-col space-y-4 hover:border-slate-700/60 transition-colors"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    item.type === "sale" 
                      ? "bg-green-500/10 border-green-500/20 text-green-400" 
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}>
                    {item.type === "sale" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{new Date(item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-black tracking-tight ${
                    item.type === "sale" ? "text-green-400" : "text-amber-500"
                  }`}>
                    {item.type === "sale" ? "+" : "-"} ₹{item.amount}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 justify-end mt-0.5">
                    {item.paymentMode === "Cash" ? <Wallet className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                    <span className="uppercase font-semibold">{item.paymentMode}</span>
                  </div>
                </div>
              </div>

              {item.type === "sale" && item.products && (
                <div className="space-y-1.5 pl-1">
                  {item.products.map((prod, pIdx) => (
                    <div key={prod._id || pIdx} className="flex justify-between items-center text-xs bg-slate-900/40 border border-slate-800/40 px-3 py-1.5 rounded-xl">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-600" />
                        ID: ...{prod.productId.slice(-5)} 
                        <span className="text-slate-500 font-bold text-[10px] bg-slate-800 px-1.5 py-0.5 rounded ml-1">x{prod.quantity}</span>
                      </span>
                      <span className="font-mono text-slate-400 font-medium">₹{prod.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {item.type === "expense" && (
                <div className="text-xs bg-slate-900/40 border border-slate-800/40 px-3 py-2 rounded-xl text-slate-400 flex flex-col space-y-1">
                  {item.note && (
                    <p className="flex items-start gap-1.5 leading-normal">
                      <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                      <span>{item.note}</span>
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 pt-0.5">Quantity Ordered: {item.quantity} units</p>
                </div>
              )}

            </div>
          ))
        )}

        <div ref={observerTarget} className="h-4 w-full flex items-center justify-center pt-2">
          {loadingMore && (
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-[#111827] border border-slate-800 px-4 py-2 rounded-full shadow-md">
              <div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Reading older transactions entries down timeline list...</span>
            </div>
          )}
          {!hasMore && visibleRecords.length > 0 && (
            <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest text-center py-4 w-full">
              🏁 Absolute baseline of ledger statement records reached
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TimelineHistory;
