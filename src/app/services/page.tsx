"use client"
import React, { useState, useEffect } from 'react';
import ServiceCard from '../../components/ServiceCard';
import DonationModal from '../../components/modals/DonationModal';
import ThirumanjanamModal from '../../components/modals/ThirumanjanamModal';
import AbisekamModal from '../../components/modals/AbisekamModal';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../userManagement/style.css';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { Clock } from 'lucide-react';
import { ColDef } from 'ag-grid-community';



type History = {
  nameOfTheService: string;
  description: string;
  paymentMode: string;
  transactionId: string;
  serviceDate: Date;
  price: string;
  status: string;
};



const ServicesPage: React.FC = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<History[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
      const userId: string = sessionData.id;
      const response = await fetch(`/api/services/user?userId=${userId}`);
      const data = await response.json();
      setHistory(data.services.personalInfo.Services);
      setFilteredHistory(data.services.personalInfo.Services);
    };

    fetchHistory();
  }, []);

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "All") {
      setFilteredHistory(history);
      return;
    }
    const selectedService = (event.target.value).toLowerCase();
    const filteredServices = history.filter(
      (service: History) => service.nameOfTheService.toLowerCase() === selectedService
    );
    setFilteredHistory(filteredServices);
  };



  const statusCellRenderer = (params: { value: string }) => {
    if (params.value === 'PENDING') {
        return (
            <div className='flex justify-left items-center text-yellow-500 font-bold'>
                <Clock size={16} style={{ marginRight: '4px' }} />
                PENDING
            </div>
        );
    }
    if (params.value === 'REJECTED') {
        return (
            <div className='flex justify-left items-center text-red-500 font-bold'>
                <RxCross1 size={16} style={{ marginRight: '4px' }} />
                REJECTED
            </div>
        );
    }
    if (params.value === 'APPROVED') {
        return (
            <div className='flex justify-left items-center text-green-500 font-bold'>
                <IoCheckmarkDone size={20} style={{ marginRight: '4px' }} />
                APPROVED
            </div>
        );
    }
    return params.value;
};

  const columnDefs: ColDef<History>[] = [
    { headerName: 'Service Name', field: 'nameOfTheService', sortable: true, filter: true },
    { headerName: 'Description', field: 'description', sortable: true, filter: true },
    { headerName: 'Payment Mode', field: 'paymentMode', sortable: true, filter: true },
    { headerName: 'Transaction ID', field: 'transactionId', sortable: true, filter: true },
    { headerName: 'Service Date', field: 'serviceDate', sortable: true, filter: true, valueFormatter: (params: { value: Date }) => new Date(params.value).toLocaleDateString() },
    { headerName: 'Price', field: 'price', sortable: true, filter: true },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, cellRenderer: statusCellRenderer },
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-[#fdf0f4]">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard
          title="Donation"
          imageSrc='https://www.mygoldguide.in/sites/default/files/styles/single_image_story_header_image/public/The%20Sacred%20Daan%20%28donation%29%20of%20Gold.jpg?itok=6Nc--uvy'
          description="Support our temple with your generous donations."
          modalComponent={<DonationModal />}
        />
        <ServiceCard
          title="Thirumanjanam"
          imageSrc="https://i.ytimg.com/vi/OzEJnTs_bqU/maxresdefault.jpg"
          description="Participate in the sacred bathing ritual of the deity."
          modalComponent={<ThirumanjanamModal />}
        />
        <ServiceCard
          title="Abisekam"
          imageSrc="https://chinnajeeyar.org/wp-content/uploads/2016/11/15032201_10154073675297205_4908543132323661187_n.jpg"
          description="Take part in the divine anointment ceremony."
          modalComponent={<AbisekamModal />}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your History</h2>
        <select
            className="block w-40 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            onChange={handleServiceChange}
        >
            <option value="All">All Services</option>
            <option value="Donation">Donation</option>
            <option value="Thirumanjanam">Thirumanjanam</option>
            <option value="Abisekam">Abisekam</option>
        </select>


        <div className="ag-theme-alpine mt-4" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={filteredHistory}
            columnDefs={columnDefs}
            animateRows={true}
            defaultColDef={{
              flex: 1,
              minWidth: 100,
              resizable: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;