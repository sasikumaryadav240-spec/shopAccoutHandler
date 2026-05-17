import axios, { AxiosError } from 'axios';

interface BackendErrorResponse {
  message?: string;
}

const SigninService = async (name : string, email : string, password : string, shopLocation : string, shopName : string) => {
  try {
    const payload = { name, email, password, shopLocation, shopName };
    const response = await axios.post("https://shopingaccount.onrender.com/api/auth/signIn", payload );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    const serverMessage = axiosError.response?.data?.message || axiosError.message || "An Unexpected error";
    
    throw new Error(serverMessage, { cause : error});
  }
}

export default SigninService