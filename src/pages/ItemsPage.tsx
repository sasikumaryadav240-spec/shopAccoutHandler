import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NewExpense from '../components/NewExpense';
import NewOrder from '../components/newOrder';
import ExpensesHistory from '../components/expenseHistory';
import SalesHistory from '../components/SalesHistory';

const ItemsPage = () => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [isSalesHistoryOpen, setSalesHistoryOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <div>
      <NewExpense 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)}  
      />
      <NewOrder
      isOpen={isOrderModalOpen}
      onClose={() => setIsOrderModalOpen(false)}
      />
      <ExpensesHistory
        isOpen={isHistoryOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <SalesHistory
      isOpen={isSalesHistoryOpen}
      onClose={() => setSalesHistoryOpen(false)}
      />
      
      <div className='flex flex-row justify-evenly items-center mx-2 gap-2'>
        <button className='bg-green-700 w-full text-2xl rounded-lg px-4 py-3 font-bold border border-green-950 shadow shadow-lg' onClick={() => setIsOrderModalOpen(true)}>
          New Order
        </button>
        <button className='bg-red-700 w-full text-2xl rounded-lg px-4 py-3 font-bold border border-red-950 shadow shadow-lg' onClick={() => setIsExpenseModalOpen(true)}>
          New Expense
        </button>
      </div>
      <div className='flex flex-row justify-evenly items-center mt-3 mx-2 gap-2'>
        <button className='bg-orange-700 w-full text-2xl rounded-lg px-4 py-3 font-bold border border-orange-950 shadow shadow-lg' onClick={() => setHistoryOpen(true)}>
          Expenses History
        </button>
        <button className='bg-gray-700 w-full text-2xl rounded-lg px-4 py-3 font-bold border border-gray-950 shadow shadow-lg' onClick={() => navigate('/products')}>
          View Products
        </button>
      </div>
      <div className='flex flex-row justify-evenly items-center mt-3 mx-2 gap-2'>
        <button className='bg-yellow-600 w-full text-2xl rounded-lg px-4 py-3 font-bold border border-yellow-950 shadow shadow-lg' onClick={() => setSalesHistoryOpen(true)}>
          Sales History
        </button>
      </div>
    </div>
  )
}

export default ItemsPage