import axios, { AxiosError } from "axios";

interface message{
    message : string
}

const changePassService = async (currentPassword : string, newPassword : string) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put("https://shopingaccount.onrender.com/api/",
        {
            currentPassword : currentPassword,
            password : newPassword
        },
        {
            headers : {
            Authrization : `Bearer ${token}`,
            "Content-Type" : "application/json" 
        }
        }
    )
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<message>;
    const serverError = axiosError.response?.data.message || axiosError.message || "An unexpected Error Occured";
    throw new Error(serverError, {cause : error})
  }
}

export default changePassService


export const deleteAccountService = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.delete("https://shopingaccount.onrender.com/api/profile",
        {
          headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
          }
        }
    )
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<message>;
    const serverError = axiosError.response?.data.message || axiosError.message || "An unexpected Error Occured";
    throw new Error(serverError, {cause : error})
  }
}