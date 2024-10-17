import React from 'react';

const ThirumanjanamModal: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Book Thirumanjanam</h2>
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
          <label htmlFor="date" className="block mb-2">Preferred Date</label>
          <input type="date" id="date" className="w-full border rounded px-3 py-2" required />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default ThirumanjanamModal;
