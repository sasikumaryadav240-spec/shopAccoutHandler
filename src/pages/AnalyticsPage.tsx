
import ChartBoard from "../components/chartBoard";
import TopSalesOfMonth from "../components/TopSalesOfMonth";

const AnalyticsPage = () => {

  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 pb-28">

      <div className="mb-8">

        <p className="text-slate-400 text-sm">
          Business Insights
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Analytics
        </h1>
      </div>

      <ChartBoard/>
      <TopSalesOfMonth/>
    </div>
  );
};

export default AnalyticsPage;