import React from 'react';

const AbisekamModal: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Book Abisekam</h2>
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
        <div className="mb-4">
          <label htmlFor="type" className="block mb-2">Abisekam Type</label>
          <select id="type" className="w-full border rounded px-3 py-2" required>
            <option value="">Select Abisekam Type</option>
            <option value="milk">Milk Abisekam</option>
            <option value="honey">Honey Abisekam</option>
            <option value="sandal">Sandal Abisekam</option>
          </select>
        </div>
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default AbisekamModal;
