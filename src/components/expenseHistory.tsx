import React, { useEffect, useState } from 'react';
import { Receipt, Trash2, Edit3, Wallet, Box, AlertTriangle, X } from 'lucide-react';
import { 
  HistoryExpenseService, 
  deleteExpenseService, 
  updateExpenseService, 
  type expenseProps 
} from '../services/HistoryService';

interface ExpensesHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExpensesHistory: React.FC<ExpensesHistoryProps> = ({ isOpen, onClose }) => {
  const [expenses, setExpenses] = useState<expenseProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({ id: '', expenseName: '', price: '', quantity: '', note: '' });

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
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await HistoryExpenseService();
        setExpenses(data.expense || []); 
      } catch (error) {
        console.error("Expenses loading error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [isOpen]);

  const confirmDeleteAction = async () => {
    setActionLoading(true);
    try {
      await deleteExpenseService(deleteModal.id);
      setExpenses(prev => prev.filter(e => e._id !== deleteModal.id));
      setDeleteModal({ open: false, id: '' });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "Operation execution failed.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (item: expenseProps) => {
    setEditForm({
      id: item._id,
      expenseName: item.expenseName,
      price: String(item.price),
      quantity: String(item.quantity),
      note: item.note || ''
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        expenseName: editForm.expenseName,
        price: Number(editForm.price),
        quantity: Number(editForm.quantity),
        note: editForm.note
      };

      await updateExpenseService(editForm.id, payload);
      
      setExpenses(prev => prev.map(e => e._id === editForm.id ? { 
        ...e, 
        expenseName: editForm.expenseName, 
        price: Number(editForm.price), 
        quantity: Number(editForm.quantity), 
        note: editForm.note 
      } : e));
      
      setEditModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "Failed to modify expense entry.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111827] border border-slate-800 w-[90vw] h-[90vh] rounded-[32px] shadow-2xl relative flex flex-col overflow-hidden select-none">
        
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-[#111827] shrink-0 sticky top-0 z-20">
          <div>
            <h1 className="text-base font-bold text-white leading-none flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-500" /> Operational Expenses Ledger
            </h1>
            <p className="text-slate-400 text-[10px] mt-1">Review shop outlays data records</p>
          </div>
          <button type="button" onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/50 shadow-md">
            <X className="w-4 h-4" /> Close Logs
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto w-full max-w-4xl mx-auto pb-24">
          {loading ? (
            <div className="h-full flex items-center justify-center py-24">
              <p className="animate-pulse text-slate-400 text-sm font-medium">Syncing expenses database lines from cloud...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-16 bg-[#1E293B]/40 rounded-3xl border border-slate-800">
              <Box className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No recorded expenses found.</p>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {expenses.map((exp) => (
                <div key={exp._id} className="bg-[#1E293B]/30 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-4 truncate">
                    <div className="bg-amber-600/10 p-3 rounded-2xl border border-amber-500/20 shrink-0">
                      <Wallet className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="truncate pr-2">
                      <h3 className="font-bold text-white text-base truncate">{exp.expenseName}</h3>
                      <p className="text-slate-400 text-xs mt-1 leading-normal truncate">{exp.note || "No notes appended."}</p>
                      <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-slate-500">
                        <span>{new Date(exp.createdAt).toLocaleDateString("en-IN")}</span>
                        <span>•</span>
                        <span>Qty: {exp.quantity}</span>
                        <span>•</span>
                        <span className="bg-slate-800 px-1.5 rounded uppercase font-bold text-slate-400">{exp.paymentMode || "Cash"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-end items-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/40">
                    <span className="text-lg font-black text-amber-500 font-mono">₹{exp.price * exp.quantity}</span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        type="button" 
                        onClick={() => handleEditClick(exp)} 
                        className="bg-[#1E293B] border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setDeleteModal({ open: true, id: exp._id })} 
                        className="bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Delete Item Entry?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone. This record will be permanently deleted from the database tracker.</p>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                disabled={actionLoading}
                onClick={() => setDeleteModal({ open: false, id: '' })} 
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                disabled={actionLoading}
                onClick={confirmDeleteAction} 
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl text-xs hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form onSubmit={handleEditSubmit} className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Modify Expense Entry</h3>
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Expense Title</label>
              <input 
                type="text" 
                required
                value={editForm.expenseName}
                onChange={e => setEditForm(prev => ({ ...prev, expenseName: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  required
                  value={editForm.price}
                  onChange={e => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Quantity</label>
                <input 
                  type="number" 
                  required
                  value={editForm.quantity}
                  onChange={e => setEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1">Additional Notes</label>
              <textarea 
                value={editForm.note}
                onChange={e => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 h-20 resize-none" 
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setEditModalOpen(false)} 
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 disabled:opacity-50"
              >
                {actionLoading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpensesHistory;
