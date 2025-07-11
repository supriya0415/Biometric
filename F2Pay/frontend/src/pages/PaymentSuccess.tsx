import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Successful!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Your payment has been processed successfully.
        </p>
        <button
          onClick={() => navigate('/send-money')}
          className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Make Another Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;