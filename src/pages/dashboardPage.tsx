import { BarChart3, History, LayoutDashboard, LogOut, Package, ShoppingCart, User } from 'lucide-react'
import logoImg from "../assets/newLogoImage.png";
import { useState } from 'react';
import HomePage from './HomePage';
import MonthlyHistory from './MonthlyHistory';
import AnalyticsPage from './AnalyticsPage';
import ProfilePage from './ProfilePage';
import ItemsPage from './ItemsPage';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [activePage, setActivePage] = useState("home");
  const [logout, setIsLogout] = useState<boolean>(false);
  const navigation = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigation("/login");
  };
  
  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24">
      <div className="fixed inset-0 bg-[#0F172A] px-5 py-3 shadow shadow-lg h-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-center">
                <img 
                  src={logoImg}
                  alt='Web Logo'
                  className='w-40 h-15'
                />
            </div>
          </div>

          <div className='flex gap-3'>
            <button className="bg-blue-600 p-3 rounded-2xl border border-blue-800" onClick={() => navigation("History")}>
              <History className="w-5 h-5 text-slate-300" />
            </button>
            <button className="bg-[#1E293B] p-3 rounded-2xl border border-slate-700" onClick={() => setIsLogout(true)}>
              <LogOut className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      </div>
      {logout && <div className='fixed inset-0 bg-black/50 px-6 flex flex-justify-center items-center'>
        <div className='bg-[#1E293B] rounded-2xl px-4 py-3 w-full border border-gray-400 flex flex-col justify-center items-center'>
          <p className=''>Are you sure want to Logout?</p>
          <div className='flex flex-row gap-3 mt-5'>
            <button
              type="button"
              onClick={() => setIsLogout(false)}
              className="w-full flex-1 items-center gap-3 text-orange-400 hover:text-white bg-orange-500/5 hover:bg-orange-600 border border-orange-500/10 hover:border-orange-500 px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-orange-950/10 active:scale-[0.98]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 text-red-400 hover:text-white bg-red-500/5 hover:bg-red-600 border border-red-500/10 hover:border-red-500 px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-red-950/10 active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4 flex-1 shrink-0" />
              <span>Exit Shop Account</span>
            </button>
          </div>
        </div>
      </div>}
      <div className="pt-24">
        {activePage === "home" && <HomePage/>}
        {activePage === "monthlyHistory" && <MonthlyHistory/>}
        {activePage === "itemsPage" && <ItemsPage/>}
        {activePage === "analytic" && <AnalyticsPage/>}
        {activePage === "profile" && <ProfilePage/>}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-slate-800 px-4 py-3">
        
        <div className="flex items-center justify-between">
          
          <button className={`flex flex-col items-center gap-1 ${activePage === "home" ? "text-blue-500" : "text-slate-500"}`} onClick={() => setActivePage("home")}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs">
              Home
            </span>
          </button>

          <button className={`flex flex-col items-center gap-1 ${activePage === "monthlyHistory" ? "text-blue-500" : "text-slate-500"}`} onClick={() => setActivePage("monthlyHistory")}>
            <Package className="w-6 h-6" />
            <span className="text-xs">
              Monthly
            </span>
          </button>

          <button className="bg-blue-600 p-4 rounded-2xl -mt-10 shadow-lg shadow-blue-900/30" onClick={() => setActivePage("itemsPage")}>
            <ShoppingCart className="w-7 h-7 text-white" />
          </button>

          <button className={`flex flex-col items-center gap-1 ${activePage === "analytic" ? "text-blue-500" : "text-slate-500"}`} onClick={() => setActivePage("analytic")}>
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">
              Analytics
            </span>
          </button>

          <button className={`flex flex-col items-center gap-1 ${activePage === "profile" ? "text-blue-500" : "text-slate-500"}`} onClick={() => setActivePage("profile")}>
            <User className="w-6 h-6" />
            <span className="text-xs">
              Profile
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage