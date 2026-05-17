import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, PersonStanding, ShelvingUnit, MapPin } from "lucide-react";
import logoImg from "../assets/newLogoImage.png";
import SigninService from "../services/signInService";
import LoginService from "../services/loginService";

const LoginPage: React.FC = () => {
  const [loginPage, setLoginPage] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPage === "login") {
      await handleloginPage(e);
    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      await signinPage(e);
    }
  };

  const handlePage = () => {
    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
    setShopName("");
    setShopLocation("");
    setError("");
    setLoginPage(loginPage === "login" ? "signIn" : "login");
  };

  const signinPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await SigninService(name, email, password, shopLocation, shopName);
      if (res && res.status === "success") {
        alert("🎉 Account created successfully! Please log in.");
        setLoginPage("login");
      } else {
        setError(typeof res === "string" ? res : "Sign In Failed");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An Unexpected Error Occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleloginPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await LoginService(email, password);
      if (res && res.accessToken && res.status === "success") {
        localStorage.setItem("accessToken", res.accessToken);
        if (res.refreshToken) {
          localStorage.setItem("refreshToken", res.refreshToken);
        }
        navigate("/");
      } else {
        setError(res?.message || "Invalid email or password configuration.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid login credentials verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#111827] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 p-8 md:p-10 flex flex-col justify-between">
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={logoImg} 
              alt="Shop Logo"
              className="w-28 h-28 object-contain" 
            />
          </div>

          <h2 className="text-3xl font-black text-white text-center">
            {loginPage === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="text-slate-400 text-xs mt-2 mb-6 text-center">
            {loginPage === "login"
              ? "Login to continue managing your digital storefront layout."
              : "Register your corporate manager credentials profiles."}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3 rounded-xl mb-5 text-center">
              ⚠️ Alert: {error}
            </div>
          )}

          {loginPage === "signIn" && (
            <div className="relative mb-4">
              <PersonStanding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}

          <div className="relative mb-4">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="relative mb-4">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter account password"
              className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-11 pr-11 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4"/> }
            </button>
          </div>

          {loginPage === "signIn" && (
            <div className="relative mb-4">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password selection"
                className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}

          {loginPage === "signIn" && (
            <div className="relative mb-4">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={shopLocation}
                onChange={(e) => setShopLocation(e.target.value)}
                placeholder="Enter Shop Hub Location"
                className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}
          {loginPage === "signIn" && (
            <div className="relative mb-5">
              <ShelvingUnit className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter Registered Shop Name"
                className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all rounded-xl py-3.5 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 active:scale-[0.98]"
          >
            <span>{loading ? "Processing Securely..." : loginPage === "login" ? "Login to Dashboard" : "Register Account"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handlePage}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors font-medium underline underline-offset-4"
          >
            {loginPage === "login" 
              ? "New to Shop Admin? Setup a fresh profile context here" 
              : "Already have an account? Access login hub"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
