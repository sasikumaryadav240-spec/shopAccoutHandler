import axios, { AxiosError } from 'axios';

interface monthlyProps {
    _id : string,
    productName : string,
    totalSales : string,
    totalAmount : string
}

export interface MonthSalesProps {
    metrics : monthlyProps[]
}

interface messageProps {
    message : string
}

const topMonthSalesService = async () : Promise<MonthSalesProps> => {
  try {
    const token  = localStorage.getItem("accessToken");
    const response = await axios.get("https://shopingaccount.onrender.com/api/topSalesOfTheMonth",{
        headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageProps>;
    const serverError = axiosError.response?.data.message || axiosError.message || "An unexpected Error";
    throw new Error(serverError, { cause : error});
  }
}

export default topMonthSalesService