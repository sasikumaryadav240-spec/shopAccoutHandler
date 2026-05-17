import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, X } from 'lucide-react';
import { deleteAccountService } from '../services/changePassService'; 
import { useNotification } from '../AppUses/useNotification';

interface DeleteAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountProps> = ({ isOpen, onClose }) => {
  const { handleNotification } = useNotification();
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationInput.toLowerCase() !== 'delete') return;

    setLoading(true);
    try {
      await deleteAccountService();
      handleNotification("Account and all associated datasets wiped successfully")
      localStorage.clear();
      window.location.href = '/login';
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Failed to terminate account profile.";
      handleNotification(errMsg,"error");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#111827] border border-red-900/30 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center animate-scaleUp">
        
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="mx-auto w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4 text-red-500">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white">Delete Shop Account?</h3>
        <p className="text-slate-400 text-xs mt-2 px-1 leading-relaxed">
          Warning: This action is permanent. Deleting your profile will instantly destroy your store configuration along with all connected <span className="text-red-400 font-semibold">Products Catalog, Sales, and Expense Timeline history metrics data logs.</span>
        </p>

        <form onSubmit={handleDelete} className="mt-5 text-left space-y-3">
          <label className="text-slate-400 text-[11px] font-medium block text-center">
            Type <span className="text-red-400 font-bold uppercase select-none">delete</span> below to confirm text validation:
          </label>
          <input
            type="text"
            required
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="Type delete to authorize deletion"
            className="w-full bg-[#1E293B] border border-slate-800 text-center tracking-wide text-white py-2.5 rounded-xl focus:outline-none focus:border-red-500 text-sm transition-colors"
          />

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 mt-5">
            <button type="button" onClick={onClose} disabled={loading} className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl py-2.5 font-semibold text-xs transition-colors">Cancel</button>
            <button
              type="submit"
              disabled={loading || confirmationInput.toLowerCase() !== 'delete'}
              className="bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {loading ? "Wiping Data..." : "Permanently Delete"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default DeleteAccountModal;
