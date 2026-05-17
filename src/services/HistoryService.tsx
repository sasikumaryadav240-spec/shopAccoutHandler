import axios, { AxiosError } from "axios";

export interface ProductNestedItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface SaleItem {
  _id: string;
  userId: string;
  products: ProductNestedItem[];
  totalAmount: number;
  paymentMethod: "Cash" | "UPI";
  createdAt: string;
  updatedAt: string;
}

export interface HistoryOrderResponse {
  sale: SaleItem[];
}

export interface expenseProps {
  _id: string;
  expenseName: string;
  price: number;
  quantity: number;
  note?: string;
  paymentMode: string;
  createdAt: string;
}

export interface ExpenseItem {
  expense: expenseProps[];
}

export interface UpdateExpensePayload {
  expenseName: string;
  price: number;
  quantity: number;
  note?: string;
}

interface messageError {
  message: string;
}

const getAuthConfig = (contentType = "application/json") => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(contentType && { "Content-Type": contentType })
    }
  };
};

export const HistoryOrderService = async (): Promise<HistoryOrderResponse> => {
  try {
    const response = await axios.get(
      "https://shopingaccount.onrender.com/api/sales", 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageError>;
    const serverError = axiosError.response?.data?.message || axiosError.message || "An Unexpected Error Occurred";
    throw new Error(serverError, { cause: error });
  }
};

export const HistoryExpenseService = async (): Promise<ExpenseItem> => {
  try {
    const response = await axios.get(
      "https://shopingaccount.onrender.com/api/expense", 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<messageError>;
    const serverError = axiosError.response?.data?.message || axiosError.message || "An Unexpected Error Occurred";
    throw new Error(serverError, { cause: error });
  }
};

export const deleteSaleService = async (id: string): Promise<void> => {
  try {
    await axios.delete(
      `https://shopingaccount.onrender.com/api/sales/${id}`, 
      getAuthConfig("")
    );
  } catch (error: unknown) {
    const axiosError = error as AxiosError<messageError>;
    const serverError = axiosError.response?.data?.message || axiosError.message || "An Unexpected Error Occurred";
    throw new Error(serverError, { cause: error });
  }
};

export const deleteExpenseService = async (id: string): Promise<void> => {
  try {
    await axios.delete(
      `https://shopingaccount.onrender.com/api/expense/${id}`, 
      getAuthConfig("")
    );
  } catch (error: unknown) {
    const axiosError = error as AxiosError<messageError>;
    const serverError = axiosError.response?.data?.message || axiosError.message || "An Unexpected Error Occurred";
    throw new Error(serverError, { cause: error });
  }
};

export const updateExpenseService = async (id: string, payload: UpdateExpensePayload): Promise<expenseProps> => {
  try {
    const response = await axios.put(
      `https://shopingaccount.onrender.com/api/expense/${id}`,
      payload,
      getAuthConfig()
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<messageError>;
    const serverError = axiosError.response?.data?.message || axiosError.message || "An Unexpected Error Occurred";
    throw new Error(serverError, { cause: error });
  }
};
