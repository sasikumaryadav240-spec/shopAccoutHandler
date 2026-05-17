import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { X, DollarSign, FileText, ShoppingBag, Layers } from 'lucide-react';
import expenseService from '../services/expenseService';
import { useNotification } from '../AppUses/useNotification';

interface NewExpenseProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewExpense: React.FC<NewExpenseProps> = ({ isOpen, onClose }) => {
  const { handleNotification } = useNotification();
  const [formData, setFormData] = useState({
    expenseName: '',
    price: '',
    quantity: '1',
    note: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await expenseService({
        expenseName: formData.expenseName,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        note: formData.note
      });
      handleNotification("Expense added Successfully👍");
      setFormData({ expenseName: '', price: '', quantity: '1', note: '' });
      onClose();
    } catch (error) {
      if(error instanceof Error){
        handleNotification(error.message,"error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      
      <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-scaleUp">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" /> Log New Expense
            </h2>
            <p className="text-slate-400 text-xs mt-1">Track operational shop outlays</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-slate-300 text-xs font-semibold block mb-1.5">Expense Name</label>
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="expenseName"
                required
                placeholder="e.g., Shop Rent, Internet Bill"
                value={formData.expenseName}
                onChange={handleChange}
                className="w-full bg-[#1E293B] border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs font-semibold block mb-1.5">Unit Price (₹)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#1E293B] border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs font-semibold block mb-1.5">Quantity</label>
              <input
                type="number"
                name="quantity"
                required
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-[#1E293B] border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-xs font-semibold block mb-1.5">Additional Notes</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <textarea
                name="note"
                placeholder="Add supplier names or invoice reference info..."
                value={formData.note}
                onChange={handleChange}
                className="w-full bg-[#1E293B] border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-medium text-sm shadow-lg shadow-blue-600/10 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewExpense;
