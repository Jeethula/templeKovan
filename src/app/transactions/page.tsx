"use client"
import React, { useState, useEffect } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { Clock, Download, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

type Service = {
  id: string;
  nameOfTheService: {
    id: string;
    name: string;
    image?: string;
  };
  description: string;
  price: number;
  image?: string;
  paymentMode: string;
  transactionId: string;
  serviceDate: Date;
  createdAt: Date;
  updatedAt: Date;
  approvedBy:{
    phone: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  }
  status: string;
};


const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFF9F0',
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#8B4513',
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginBottom: 20,
  },
  decorativeLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#8B4513',
    marginBottom: 20,
    opacity: 0.3,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 25,
    border: '1px solid #D4AF37',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1px solid #F0E6D6',
  },
  label: {
    width: '40%',
    fontSize: 11,
    color: '#8B4513',
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    width: '60%',
    fontSize: 11,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  footer: {
    marginTop: 30,
    padding: 20,
    borderTop: '2px solid #D4AF37',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#8B4513',
    textAlign: 'center',
    fontFamily: 'Helvetica',
    marginBottom: 5,
  },
  blessingText: {
    fontSize: 14,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 15,
  },
  receiptTitle: {
    fontSize: 16,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ornament: {
    fontSize: 24,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 10,
  },
});

const MyDocument: React.FC<{ 
  rowData: Service; 
  userData: { 
    id: string; 
    email: string; 
    phone: string 
  }; 
  approvedByData:{
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
}> = ({ rowData, userData, approvedByData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Sri Renuka Akkamma Temple</Text>
        <Text style={styles.subtitle}></Text>
        <View style={styles.decorativeLine} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.ornament}>☸</Text>
        <Text style={styles.receiptTitle}>Seva Receipt</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Devotee ID</Text>
          <Text style={styles.value}>{userData.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Contact Details</Text>
          <Text style={styles.value}>{userData.phone} | {userData.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seva Name</Text>
          <Text style={styles.value}>{rowData.nameOfTheService.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{rowData.description}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seva Date</Text>
          <Text style={styles.value}>{new Date(rowData.serviceDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Offering Amount</Text>
          <Text style={styles.value}>₹{rowData.price}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Details</Text>
          <Text style={styles.value}>
            {rowData.paymentMode} | Trans. ID: {rowData.transactionId}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Approved By</Text>
          <Text style={styles.value}>{approvedByData?.firstName} {approvedByData?.lastName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Approver Contact</Text>
          <Text style={styles.value}>{approvedByData?.phoneNumber}</Text>
        </View>

        <View style={[styles.row, { borderBottom: 'none' }]}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{rowData.status}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a computer generated receipt. No signature required.
        </Text>
        <Text style={styles.footerText}>
          For any queries, please contact the temple office.
        </Text>
        {/* <Text style={styles.blessingText}>
          
        </Text> */}
      </View>
    </Page>
  </Document>
);

// Add this component at the top of your file
const TransactionSkeleton = () => (
  <div className="bg-white rounded-xl border border-purple-100 shadow-sm animate-pulse">
    <div className="p-4 space-y-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start">
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded"></div>
        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
      </div>

      {/* Details Section Skeleton */}
      <div className="bg-gray-50/80 rounded-lg p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="col-span-2 space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-full bg-gray-200 rounded-full"></div>
        <div className="h-8 w-full bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

const TransactionsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<Service[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const userId: string = sessionData.id;
      const response = await fetch(`/api/services/user?userId=${userId}`);
      const data = await response.json();
      setHistory(data.services.services);
      setFilteredHistory(data.services.services);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceChange = (value: string) => {
    if (value === "All") {
      setFilteredHistory(history);
      return;
    }
    const filtered = history.filter(service => 
      service.nameOfTheService.name.toLowerCase() === value.toLowerCase()
    );
    setFilteredHistory(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = history.filter(service => 
      service.nameOfTheService.name.toLowerCase().includes(term) ||
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
  const handleDownload = (transaction:Service) => {  
    const approvedByData = transaction.approvedBy ? {
      firstName: transaction.approvedBy.personalInfo.firstName,
      lastName: transaction.approvedBy.personalInfo.lastName,
      phoneNumber: transaction.approvedBy.phone
    } : { firstName: 'Not Approved Yet', lastName: '', phoneNumber: '' };

    return (
      <PDFDownloadLink 
        document={<MyDocument rowData={transaction} userData={sessionData} approvedByData={approvedByData} />}
        fileName="Service_Details.pdf"
      >
        <button className="w-full flex items-center justify-center gap-1.5 text-purple-700 
                           text-xs font-medium  px-3 py-2 
                           rounded-full transition-colors duration-200">
          <Download className="w-3 h-3" />
        </button>
      </PDFDownloadLink>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-purple-800">Transactions</h1>
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
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-purple-200 rounded-xl 
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
              {Array.from(new Set(history.map(service => service.nameOfTheService.name))).map(serviceName => (
              <SelectItem key={serviceName} value={serviceName}>
                {serviceName}
              </SelectItem>
              ))}
            </SelectContent>
            </Select>
        </div>

        {/* Transaction Cards */}
        <div className="space-y-4">
          {isLoading ? (
            // Show 3 skeleton cards while loading
            [...Array(3)].map((_, index) => (
              <TransactionSkeleton key={index} />
            ))
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((transaction, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md 
                         transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 flex flex-col justify-between">
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-purple-900 truncate">
                        {transaction.nameOfTheService.name}
                      </h3>
                      <div className='flex gap-x-2'>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 
                                     border ${getStatusBadgeClass(transaction.status)}`}>
                        <StatusIcon status={transaction.status} />
                        {transaction.status}
                      </span>
                      {handleDownload(transaction)}
                      </div>
                   
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {transaction.description}
                    </p>
                  </div>
                  {/* <div className="flex justify-center my-4">
                    <img
                      src={transaction.nameOfTheService.image || transaction.nameOfTheService.image}
                      alt={transaction.nameOfTheService.name}
                      className="w-full h-32 object-contain rounded-lg"
                    />
                  </div> */}

                  {/* Transaction Details */}
                  <div className="space-y-3 bg-gray-50/80 rounded-lg p-3 my-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        {transaction.nameOfTheService.name !== 'Contribution' ? (
                          <>
                            <p className="text-gray-500">Service Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(transaction.serviceDate).toISOString().split('T')[0] || "N/A"}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-500">Donation Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(transaction.createdAt).toISOString().split('T')[0] || "N/A"}
                            </p>
                          </>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-medium text-gray-900">₹{transaction.price}</p>
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-500">Transaction ID</p>
                          <p className="font-medium text-gray-900 truncate">{transaction.transactionId}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Paid via</p>
                          <p className="font-medium text-gray-900">{transaction.paymentMode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}

                </div>
              </div>
            ))
          ) : (
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