import React, { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { X, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import changePassService from '../services/changePassService'; 
import { useNotification } from '../AppUses/useNotification';

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordProps> = ({ isOpen, onClose }) => {
  const { handleNotification } = useNotification();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return handleNotification("New passwords do not match!","error");
    }
    if (formData.newPassword.length < 8) {
      return handleNotification("Password must be at least 8 characters long", "error");
    }

    setLoading(true);
    try {
      await changePassService(formData.currentPassword, formData.newPassword);
      handleNotification("🎉 Password changed successfully!")
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onClose();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Failed to change password.";
      handleNotification(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-scaleUp">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/10 p-2 rounded-xl border border-blue-500/20">
              <KeyRound className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              <p className="text-slate-400 text-xs mt-0.5">Update your account credentials</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-xs font-semibold block mb-1.5">Current Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPass.current ? "text" : "password"}
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full bg-[#1E293B] border border-slate-700 text-white pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-colors"
              />
              <button type="button" onClick={() => setShowPass(p => ({...p, current: !p.current}))} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300">
                {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-xs font-semibold block mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPass.new ? "text" : "password"}
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#1E293B] border border-slate-700 text-white pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-colors"
              />
              <button type="button" onClick={() => setShowPass(p => ({...p, new: !p.new}))} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300">
                {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-xs font-semibold block mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPass.confirm ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-type new password"
                className="w-full bg-[#1E293B] border border-slate-700 text-white pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-colors"
              />
              <button type="button" onClick={() => setShowPass(p => ({...p, confirm: !p.confirm}))} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300">
                {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl font-medium text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm shadow-lg transition-colors">
              {loading ? "Updating..." : "Save Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
