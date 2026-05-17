import {
  User,
  Mail,
  Store,
  MapPin,
  Lock,
  Edit,
  AlignStartVertical,
  LucideAlignVerticalDistributeStart
} from "lucide-react";
import { useEffect, useState } from "react";
import type { profileProps } from "../services/profileService";
import profileService from "../services/profileService";
import ChangePasswordModal from "../components/ChangePassword";
import DeleteAccountModal from "../components/deleteAccount";

const ProfilePage = () => {
  const [data, setData] = useState<profileProps>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isPassChangeOpen, setIsPassChangeOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await profileService();
        setData(res);
      } catch (error) {
        if(error instanceof Error){
          setError(error.message)
        }
      }finally{
        setLoading(false);
      }
    }
    handleProfile();
  },[])

  const rawdata = data?.user.createdAt

  const date = rawdata ? 
  new Date(rawdata).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  : 'LoadingDate...';

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 pb-28">
      {isPassChangeOpen && <ChangePasswordModal isOpen={isPassChangeOpen} onClose={() => setIsPassChangeOpen(false)}/>}
      {isDeleteOpen && <DeleteAccountModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}/>}

      {error && !loading && <p className="text-3xl text-red-500 font-bold">{error}</p>}

      {loading && !error && <div className="animate-pulse bg-gray-500 border border-slate-800 rounded-[32px] p-6 shadow-xl">

        <div className="flex flex-col items-center">

          <div className="relative">

            <div className="w-28 h-28 rounded-full bg-gray-600 flex items-center justify-center shadow-lg">

            </div>
          </div>

          <h2 className="mt-5 h-6 w-full px-5 bg-gray-600">
            
          </h2>

          <p className="mt-5 h-5 w-full px-5 bg-gray-600">
            
          </p>
        </div>

        <div className="mt-8 space-y-4">

          <div className="bg-gray-500 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-gray-600 p-3 rounded-2xl">
              <Store className="w-5 h-5 text-gray-600" />
            </div>

            <div>
              <p className="mt-5 h-6 w-full px-5 bg-gray-600">
                
              </p>

              <h3 className="mt-5 h-5 w-full px-5 bg-gray-600">
                
              </h3>
            </div>
          </div>

          <div className="bg-gray-500 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-gray-600 p-3 rounded-2xl">
              <Store className="w-5 h-5 text-gray-600" />
            </div>

            <div>
              <p className="mt-5 h-6 w-full px-5 bg-gray-600">
                
              </p>

              <h3 className="mt-5 h-5 w-full px-5 bg-gray-600">
                
              </h3>
            </div>
          </div>

          <div className="bg-gray-500 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-gray-600 p-3 rounded-2xl">
              <Store className="w-5 h-5 text-gray-600" />
            </div>

            <div>
              <p className="mt-5 h-6 w-full px-5 bg-gray-600">
                
              </p>

              <h3 className="mt-5 h-5 w-full px-5 bg-gray-600">
                
              </h3>
            </div>
          </div>

          <div className="bg-gray-500 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-gray-600 p-3 rounded-2xl">
              <Store className="w-5 h-5 text-gray-600" />
            </div>

            <div>
              <p className="mt-5 h-6 w-full px-5 bg-gray-600">
                
              </p>

              <h3 className="mt-5 h-5 w-full px-5 bg-gray-600">
                
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">

          <button className="w-full bg-[#1E293B] border border-slate-700 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800 transition-all">

            <div className="bg-gray-500 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-gray-600 p-3 rounded-2xl">
              <Store className="w-5 h-5 text-gray-600" />
            </div>

            <div>
              <p className="mt-5 h-6 w-full px-5 bg-gray-600">
                
              </p>

              <h3 className="mt-5 h-5 w-full px-5 bg-gray-600">
                
              </h3>
            </div>
          </div>
          </button>

          <button className="w-full bg-gray-600 rounded-2xl p-4 flex items-center justify-center gap-3">

            <LucideAlignVerticalDistributeStart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>}

      {!loading && !error && <div className="bg-[#111827] border border-slate-800 rounded-[32px] p-6 shadow-xl">

        <div className="flex flex-col items-center">

          <div className="relative">

            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">

              <User className="w-14 h-14 text-white" />
            </div>

            <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-4 border-[#111827]">
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>

          <h2 className="text-2xl font-bold mt-5">
            {data?.user.name}
          </h2>

          <p className="text-slate-400 mt-2">
            {data?.user.email}
          </p>
        </div>

        <div className="mt-8 space-y-4">

          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-blue-600/20 p-3 rounded-2xl">
              <Store className="w-5 h-5 text-blue-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Shop Name
              </p>

              <h3 className="font-semibold mt-1">
                {data?.user.shopName}
              </h3>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-purple-600/20 p-3 rounded-2xl">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Email Address
              </p>

              <h3 className="font-semibold mt-1">
                {data?.user.email}
              </h3>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-pink-600/20 p-3 rounded-2xl">
              <AlignStartVertical className="w-5 h-5 text-pink-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Since
              </p>

              <h3 className="font-semibold mt-1">
                {date}
              </h3>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 flex items-center gap-4">

            <div className="bg-orange-600/20 p-3 rounded-2xl">
              <MapPin className="w-5 h-5 text-orange-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Shop Location
              </p>

              <h3 className="font-semibold mt-1">
                {data?.user.shopLocation}
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">

          <button className="w-full cursor-pointer bg-[#1E293B] border border-slate-700 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800 transition-all" onClick={() => setIsPassChangeOpen(true)}>

            <div className="flex items-center gap-4">

              <div className="bg-yellow-500/20 p-3 rounded-2xl">
                <Lock className="w-5 h-5 text-yellow-400" />
              </div>

              <div className="text-left">
                <p className="font-semibold">
                  Change Password
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  Update your account password
                </p>
              </div>
            </div>
          </button>

          <button className="w-full bg-orange-600 rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-lg shadow-red-900/30" onClick={() => setIsDeleteOpen(true)}>

            <LucideAlignVerticalDistributeStart className="w-5 h-5 text-white" />

            <span className="font-semibold">
              Delete Account
            </span>
          </button>
        </div>
      </div>}
    </div>
  );
};

export default ProfilePage;