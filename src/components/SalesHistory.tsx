import React, { useEffect, useState } from 'react';
import { ShoppingBag, Calendar, Trash2, Box, AlertTriangle, X } from 'lucide-react';
import { HistoryOrderService, deleteSaleService, type SaleItem } from '../services/HistoryService';

interface SalesHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ isOpen, onClose }) => {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchSales = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await HistoryOrderService();
        setSales(data.sale || []);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [isOpen]);

  const confirmDeleteAction = async () => {
    if (!deleteModal.id) return;
    setActionLoading(true);
    setError("");
    try {
      await deleteSaleService(deleteModal.id);
      setSales(prev => prev.filter(s => s._id !== deleteModal.id));
      setDeleteModal({ open: false, id: '' });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* 90% Width and Height Card Frame Workspace */}
      <div className="bg-[#111827] border border-slate-800 w-[90vw] h-[90vh] rounded-[32px] shadow-2xl relative flex flex-col overflow-hidden select-none">
        
        {/* Sticky Header App Bar Panel (Locked to Top) */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-[#111827] shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/10 p-2 rounded-xl border border-blue-500/20">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">Sales Invoices History</h1>
              <p className="text-slate-400 text-[10px] mt-1">Review shop checkout receipts parameters</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/50 shadow-md"
          >
            <X className="w-4 h-4" /> Close Logs
          </button>
        </div>

        {/* Scrollable Contents Feed Tracking Container */}
        <div className="flex-1 p-6 overflow-y-auto w-full max-w-4xl mx-auto pb-24 custom-scrollbar">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3.5 rounded-xl mb-4 text-center">
              ⚠️ Server Sync Alert: {error}
            </div>
          )}

          {loading ? (
            <div className="h-full flex items-center justify-center py-24">
              <p className="animate-pulse text-slate-400 text-sm font-medium">Syncing checkout matrix from cloud...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-16 bg-[#1E293B]/40 rounded-3xl border border-slate-800">
              <Box className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No checkout sales receipts found.</p>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {sales.map((sale) => (
                <div 
                  key={sale._id}
                  className="bg-[#1E293B]/30 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
                >
                  {/* Metadata Header Line Summary */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-800/40">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(sale.createdAt).toLocaleDateString("en-IN", { dateStyle: 'medium' })}
                      </span>
                      <span className="bg-blue-600/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {sale.paymentMethod || 'N/A'}
                      </span>
                    </div>
                    <span className="text-base font-black text-emerald-400">₹{sale.totalAmount}</span>
                  </div>

                  {/* Sub-grid list of lines nested within each sale array card layout */}
                  <div className="space-y-2">
                    {sale.products?.map((prod, pIdx) => (
                      <div 
                        key={prod._id || pIdx}
                        className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-800/40"
                      >
                        {/* 🟢 FIXED: Added product name display and item count tracker layout */}
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{prod.name || 'Unknown Product'}</span>
                          <span className="text-slate-500 font-medium">x {prod.quantity || 1}</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-semibold">₹{prod.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      type="button"
                      onClick={() => setDeleteModal({ open: true, id: sale._id })}
                      className="bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Void Sale
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* OVERLAY POPUP MODAL SCREEN DIALOG: VOID STATEMENT CONFIRMATION */}
      {/* 🟢 FIXED: Completed the broken, missing markup for this confirmation dialogue wrapper */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#111827] border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center relative animate-scaleUp">
            <div className="mx-auto w-14 h-14 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            
            <h3 className="text-xl font-bold text-white">Void This Invoice?</h3>
            <p className="text-slate-400 text-sm mt-2 px-2 leading-relaxed">
              Are you sure you want to delete this specific sales record timeline profile? This modification cannot be undone and will alter total calculated collection indicators.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800/80">
              <button 
                type="button" 
                onClick={() => setDeleteModal({ open: false, id: '' })} 
                disabled={actionLoading} 
                className="bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs py-2.5 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmDeleteAction} 
                disabled={actionLoading} 
                className="bg-red-600 text-white font-semibold rounded-xl text-xs py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Voiding..." : "Confirm Void"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
