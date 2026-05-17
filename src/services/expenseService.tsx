import axios, { AxiosError } from "axios";

interface ExpensePayload {
  expenseName: string;
  price: number;
  quantity: number;
  note: string;
}

interface messageProps{
    message : string
}

const expenseService = async (formData: ExpensePayload) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.post("https://shopingaccount.onrender.com/api/expense",
      {
        expenseName: formData.expenseName,
        price: formData.price,
        quantity: formData.quantity,
        note: formData.note
      },
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
    const serverError = axiosError.response?.data.message || axiosError.message || "An Unexpected Error";
    throw new Error(serverError, {cause : error})
  }
};

export default expenseService;
