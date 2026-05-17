import { Route, Routes } from 'react-router-dom';
import './App.css';
import DashboardPage from './pages/dashboardPage';
import LoginPage from './pages/loginPage';
import Protectedpages from "./AppUses/Protectedpages";
import ProductPage from './pages/ProductPage';
import TimelineHistory from './pages/AllTmeHistory';
import { NotificationProvider } from './components/notificationContext';

function App() {

  return (
    <>
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={ <LoginPage /> }/>
          <Route element={<Protectedpages/>}>
            <Route path="/" element={ <DashboardPage /> }/>
            <Route path="/products" element={<ProductPage/>}/>
            <Route path="/history" element={<TimelineHistory/>}/>
          </Route>
          <Route path="*" element={
          <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
            <h1 className="text-xl font-semibold">404 - Page Not Found</h1>
          </div>
        } />
        </Routes>
      </NotificationProvider>
    </>
  )
}

export default App
