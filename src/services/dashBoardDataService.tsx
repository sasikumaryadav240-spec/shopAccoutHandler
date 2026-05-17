import axios, { AxiosError } from 'axios';

interface BackendErrorResponse {
  message?: string;
}

export interface dailySalesSummary {
  totalSales: number;
  totalRevenue: number;
}

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  totalAmount: number;
}

export interface DashboardDataPayload {
  status: string;
  dailySales: dailySalesSummary;
  monthSales: SalesSummary;
  monthExpense: ExpenseSummary;
}


const dashBoardDataService = async (): Promise<DashboardDataPayload> => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get("https://shopingaccount.onrender.com/api/monthlyDashBoard",{
        headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }
    })

    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    const serverMessage = axiosError.response?.data?.message || axiosError.message || "An Unexpected error";
    
    throw new Error(serverMessage, { cause : error});
  }
}

export default dashBoardDataService