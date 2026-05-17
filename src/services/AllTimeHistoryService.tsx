import axios, { AxiosError } from "axios";

export interface TimelineProductItem {
  productId: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface TimelineItem {
  _id: string;
  type: "sale" | "expense";
  title: string;
  amount: number;
  paymentMode: string;
  createdAt: string;
  products?: TimelineProductItem[];
  quantity?: number;
  note?: string;
}

export interface TimelineApiResponse {
  status: string;
  timelineCount: number;
  timeline: TimelineItem[];
}

interface message {
    message : string
}

export const getTimelineService = async (): Promise<TimelineApiResponse> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("https://shopingaccount.onrender.com/api/history", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<message>;
    const serverError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error Occured";
    throw new Error(serverError, {cause : error});
  }
};
