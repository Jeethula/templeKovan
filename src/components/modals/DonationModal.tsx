import React from 'react';

const DonationModal: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input type="text" id="name" className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input type="email" id="email" className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block mb-2">Amount</label>
          <input type="number" id="amount" className="w-full border rounded px-3 py-2" required />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Donate
        </button>
      </form>
    </div>
  );
};

export default DonationModal;
