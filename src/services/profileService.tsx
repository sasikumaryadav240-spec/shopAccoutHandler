import axios, { AxiosError } from 'axios';

interface messageError {
    message : string
}

export interface profile {
    name : string,
    email : string,
    shopName : string,
    createdAt : string,
    shopLocation : string
}

export interface profileProps {
    user : profile
}

const profileService = async (): Promise<profileProps> => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("https://shopingaccount.onrender.com/api/profile",{
            headers : {
                Authorization : `Bearer ${token}`,
                "Content-Type" : "application/json"
            }
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<messageError>;
        const serverError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error";
        throw new Error(serverError, {cause : error});
    }
}

export default profileService