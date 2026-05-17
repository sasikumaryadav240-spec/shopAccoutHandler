import axios, { AxiosError } from "axios";

interface messageProps {
    message :string
}

interface chart {
    year : number,
    month : number,
    noOfSales : number,
    totalRevenue : number
}

export interface yearProps {
    yearMetrics : chart[]
}


const chartBoardService = async () : Promise<yearProps> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("https://shopingaccount.onrender.com/api/fullYearHistory",{
        headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageProps>;
    const serverError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error";
    throw new Error(serverError, {cause : error});
  }
}

export default chartBoardService