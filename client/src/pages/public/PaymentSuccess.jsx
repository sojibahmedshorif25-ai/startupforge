import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      api.get(`/payments/success?session_id=${sessionId}`)
        .then(({ data }) => setStatus(data.success ? 'success' : 'failed'))
        .catch(() => setStatus('failed'));
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-10 text-center max-w-md w-full"
      >
        {status === 'processing' ? (
          <>
            <FiLoader className="mx-auto text-5xl text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-500">Please wait a moment...</p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-emerald-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-8">You now have premium access to post unlimited opportunities.</p>
            <Link to="/dashboard/founder" className="btn-primary inline-flex items-center">
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiXCircle className="text-red-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-500 mb-8">Something went wrong. Please try again.</p>
            <Link to="/dashboard/founder" className="btn-primary inline-flex items-center">
              Try Again
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
