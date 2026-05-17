import axios, { AxiosError } from 'axios';

interface BackendErrorResponse {
  message?: string;
}

const LoginService = async (email : string, password : string) => {
  try {
    const payload = { email, password };
    const response = await axios.post("https://shopingaccount.onrender.com/api/auth/login", payload );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
        const serverMessage = axiosError.response?.data?.message || axiosError.message || "An Unexpected error";
        
        throw new Error(serverMessage, { cause : error});
  }
}

export default LoginService