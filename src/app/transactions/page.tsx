"use client"
import React, { useState, useEffect } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { Clock, Download, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Service = {
  nameOfTheService: string;
  description: string;
  paymentMode: string;
  transactionId: string;
  serviceDate: Date;
  amount: string;
  approvedBy: string;
  status: string;
};

const TransactionsPage = () => {
  const [history, setHistory] = useState<Service[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const userId: string = sessionData.id;
    const response = await fetch(`/api/services/user?userId=${userId}`);
    const data = await response.json();
    setHistory(data.services.personalInfo.Services);
    setFilteredHistory(data.services.personalInfo.Services);
  };

  const handleServiceChange = (value: string) => {
    if (value === "All") {
      setFilteredHistory(history);
      return;
    }
    const filtered = history.filter(service => 
      service.nameOfTheService.toLowerCase() === value.toLowerCase()
    );
    setFilteredHistory(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = history.filter(service => 
      service.nameOfTheService.toLowerCase().includes(term) ||
      service.transactionId.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term)
    );
    setFilteredHistory(filtered);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-100';
      case 'APPROVED':
        return 'bg-green-50 text-green-700 border-green-200 ring-green-100';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200 ring-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-100';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-3 h-3" />;
      case 'APPROVED':
        return <IoCheckmarkDone className="w-3 h-3" />;
      case 'REJECTED':
        return <RxCross1 className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-purple-800">Transactions</h1>
          <p className="text-sm text-gray-600">View your service bookings</p>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-purple-200 rounded-xl 
                       focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white/80
                       backdrop-blur-sm transition-all duration-200"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
          </div>

          <Select onValueChange={handleServiceChange}>
            <SelectTrigger className="w-full border border-purple-200 text-sm">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Services</SelectItem>
              <SelectItem value="Donation">Donation</SelectItem>
              <SelectItem value="Thirumanjanam">Thirumanjanam</SelectItem>
              <SelectItem value="Abisekam">Abisekam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Cards */}
        <div className="space-y-4">
          {filteredHistory.map((transaction, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md 
                       transition-all duration-300 h-[280px] overflow-hidden"
            >
              <div className="p-4 h-full flex flex-col justify-between">
                {/* Card Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-purple-900 truncate">
                      {transaction.nameOfTheService}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 
                                   border ${getStatusBadgeClass(transaction.status)}`}>
                      <StatusIcon status={transaction.status} />
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {transaction.description}
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="space-y-3 bg-gray-50/80 rounded-lg p-3 my-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(transaction.serviceDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium text-gray-900">₹{transaction.amount}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Transaction ID</p>
                      <p className="font-medium text-gray-900 truncate">{transaction.transactionId}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-600 bg-purple-50 px-3 py-1.5 rounded-full text-center">
                    Paid via <span className="font-medium">{transaction.paymentMode}</span>
                  </div>
                  <button className="w-full flex items-center justify-center gap-1.5 text-purple-700 
                                   text-xs font-medium bg-purple-50 hover:bg-purple-100 px-3 py-2 
                                   rounded-full transition-colors duration-200">
                    <Download className="w-3 h-3" />
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 bg-white rounded-xl border border-purple-100">
              <p className="text-gray-500 text-sm">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;