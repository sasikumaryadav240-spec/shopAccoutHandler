import axios, { AxiosError } from 'axios';

interface BackendErrorResponse {
  message?: string;
}

export interface products {
    _id : string,
    productName : string,
    noOfSales : number,
    totalSalesAmount : number
}

export interface topsales {
    metrics : products[]
}

const topsalesService = async () : Promise<topsales> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("https://shopingaccount.onrender.com/api/productDashBoard",{
        headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    const serverMessage = axiosError.response?.data?.message || axiosError.message || "An Unexpected error";
    
    throw new Error(serverMessage, { cause : error});
  }
}

export default topsalesService