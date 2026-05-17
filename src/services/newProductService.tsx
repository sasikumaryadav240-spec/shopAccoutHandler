import axios, { AxiosError } from "axios";

interface messageError {
    message : string
}

export const createProductService = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(
      "https://shopingaccount.onrender.com/api/product",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageError>;
    const severError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error";
    throw new Error(severError, {cause : error});
  }
};

interface ProductItem {
  _id: string;
  userId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface productsProps {
  product: ProductItem[];
}


export const getProductService = async () : Promise<productsProps> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      "https://shopingaccount.onrender.com/api/products",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        }
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageError>;
    const severError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error";
    throw new Error(severError, {cause : error});
  }
};

export const updateProductService = async (id: string, formData: FormData): Promise<productsProps> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.put(
      `https://shopingaccount.onrender.com/api/product/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageError>;
    const severError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error";
    throw new Error(severError, {cause : error});
  }
};


export const deleteProductService = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`https://shopingaccount.onrender.com/api/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    const axiosError = error as AxiosError<messageError>;
    const severError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error";
    throw new Error(severError, {cause : error});
  }
};

