"use client";

import { useEffect, useState } from 'react';

interface GooglePayButtonProps {
  amount: string;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: Error) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

const GooglePayButton: React.FC<GooglePayButtonProps> = ({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError,
  onClose 
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!window.google?.payments?.api) {
      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.onload = () => setIsReady(true);
      document.body.appendChild(script);
    } else {
      setIsReady(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!window.google?.payments?.api) return;

    const client = new window.google.payments.api.PaymentsClient({
      environment: 'TEST' // Change to 'PRODUCTION' when going live
    });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId'
          }
        }
      }],
      merchantInfo: {
        merchantId: 'BCR2DN4T4OTL7TZH',
        merchantName: 'Temple Services'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: amount,
        currencyCode: 'INR'
      }
    };

    try {
      const paymentData = await client.loadPaymentData(paymentDataRequest);
      onPaymentSuccess?.(paymentData);
    } catch (err) {
      onPaymentError?.(err as Error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Google Pay Payment</h3>
        <p className="mb-4">Amount: ₹{amount}</p>
        {isReady ? (
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Pay with Google Pay
          </button>
        ) : (
          <div>Loading Google Pay...</div>
        )}
      </div>
    </div>
  );
};

export default GooglePayButton;
