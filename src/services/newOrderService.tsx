import axios, { AxiosError } from "axios";

export interface OrderItemPayload {
  productId: string;
  name: string;
  quantity: number;
}

export interface OrderPayload {
  items: OrderItemPayload[];
  paymentMethod: "Cash" | "UPI";
}

interface messageProps {
    message: string
}

export const createOrderService = async (payload: OrderPayload): Promise<OrderPayload> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(
      "https://shopingaccount.onrender.com/api/sales",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageProps>;
    const serverError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error Occured";
    throw new Error(serverError, {cause : error});
  }
};
