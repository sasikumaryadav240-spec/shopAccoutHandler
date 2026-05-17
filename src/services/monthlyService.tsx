import axios, { AxiosError } from 'axios'

interface messageError {
    message : string
}

export interface history {
    year : number,
    month : number,
    noOfSales : number,
    totalRevenue : number,
    totalExpense : number
}

export interface monthlyProps {
    combinedHistory : history[]
}

const monthlyService = async () : Promise<monthlyProps> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("https://shopingaccount.onrender.com/api/monthlyHistory",{
        headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "applcation/json"
        }
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageError>;
    const serverError = axiosError.response?.data?.message || axiosError.message || "An UnExpected Error";
    throw new Error(serverError, { cause: error})
  }
}

export default monthlyService