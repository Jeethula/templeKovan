"use client"
import React, { useState, useEffect } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import {Clock, Download, Search , ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
// import { FaRupeeSign } from 'react-icons/fa';

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
    posUser:{
      phone: string;
      email: string;
      personalInfo: {
        firstName: string;
        lastName: string;
      }
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
          <Text style={styles.label}>{rowData.serviceDate ? "Service Date" : "Donation Date"}</Text>
          <Text style={styles.value}>{rowData.serviceDate?(new Date(rowData.serviceDate).toLocaleDateString('en-GB')):(new Date(rowData.createdAt).toLocaleDateString('en-GB'))}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Offering Amount</Text>
          <Text style={styles.value}>{rowData.price} INR</Text>
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
          <Text style={styles.value}>{approvedByData?.phoneNumber||"Not Approved Yet"}</Text>
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


const MyDocumentForPos: React.FC<{ 
  rowData: Service; 
  userData: { 
    id: string; 
    email: string; 
    phone: string 
  }; 
  posUserData:{
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
}> = ({ rowData, userData, posUserData }) => (
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
          <Text style={styles.value}>{new Date(rowData.serviceDate).toLocaleDateString('en-GB')}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Offering Amount</Text>
          <Text style={styles.value}>{rowData.price} INR</Text>
        </View>


        <View style={styles.row}>
          <Text style={styles.label}>POS User By</Text>
          <Text style={styles.value}>{posUserData?.firstName} {posUserData?.lastName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>POS Contact</Text>
          <Text style={styles.value}>{posUserData?.phoneNumber}</Text>
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Service[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);
  
  // Move all useEffect hooks here, at the top level
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchHistory(1);
  }, [activeFilter, searchTerm]);

  // Rest of your component logic...
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchHistory = async (page: number) => {
    try {
      setIsLoadingMore(true);
      setError(null);
      const userId: string = sessionData.id;
      const offset = (page - 1) * itemsPerPage;
      
      const url = `/api/services/user?userId=${userId}&limit=${itemsPerPage}&offset=${offset}${
        activeFilter !== "All" ? `&serviceName=${encodeURIComponent(activeFilter)}` : ''
      }${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      // Replace the existing data instead of concatenating
      setHistory(data.services.services);
      setFilteredHistory(data.services.services);
      setTotalCount(data.services.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Move the error check after all hooks
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchHistory(currentPage)}>Retry</Button>
      </div>
    );
  }

  // Rest of your component JSX...
  const Pagination = () => {
    if (totalCount <= itemsPerPage) return null;

    return (
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentPage(1);
            fetchHistory(1);
          }}
          disabled={currentPage === 1 || isLoadingMore}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            fetchHistory(newPage);
          }}
          disabled={currentPage === 1 || isLoadingMore}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            fetchHistory(newPage);
          }}
          disabled={currentPage === totalPages || isLoadingMore}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentPage(totalPages);
            fetchHistory(totalPages);
          }}
          disabled={currentPage === totalPages || isLoadingMore}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    );
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
    if(transaction.posUser)
      {
        const posUserData={
          firstName: transaction.posUser.personalInfo.firstName,
          lastName: transaction.posUser.personalInfo.lastName,
          phoneNumber: transaction.posUser.phone

        }
        return (
          <PDFDownloadLink 
            document={<MyDocumentForPos rowData={transaction} userData={sessionData} posUserData={posUserData} />}
            fileName="Service_Details.pdf"
          >
            <button className="w-full flex items-center justify-center gap-1.5 text-purple-700 
                               text-xs font-medium  px-3 py-2 
                               rounded-full transition-colors duration-200">
              <Download className="w-3 h-3" />
            </button>
          </PDFDownloadLink>
        )
      } 
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
          <p className="text-sm text-gray-600">View all your history of transactions.</p>
        </div>

        {/* Filters */}
        <div id="search-container" className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowFilters(true)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-purple-200 rounded-xl 
                       focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white/80
                       backdrop-blur-sm transition-all duration-200"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
          </div>
          
          {showFilters && (
            <div className="absolute z-50 text-md top-full left-0 right-0 mt-1 bg-white rounded-xl border 
                            border-purple-100 shadow-lg p-3">
              <div className="flex flex-wrap gap-2">
                {["All", ...Array.from(new Set(history.map(service => 
                  service.nameOfTheService.name)))].map((serviceName) => (
                  <button
                    key={serviceName}
                    onClick={() => {
                      setActiveFilter(serviceName);
                      if (serviceName === "All") {
                        setFilteredHistory(history);
                      } else {
                        setFilteredHistory(history.filter(service => 
                          service.nameOfTheService.name === serviceName
                        ));
                      }
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${activeFilter === serviceName 
                        ? 'bg-gray-100 border-[0.5px] border-purple-600  text-black shadow-sm' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-purple-50'}`}
                  >
                    {serviceName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add selected filter badge */}
        {activeFilter !== "All" && (
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm 
                          bg-purple-100 text-purple-700 border border-purple-200">
              {activeFilter}
              <button
                onClick={() => {
                  setActiveFilter("All");
                  setFilteredHistory(history);
                  setCurrentPage(1);
                }}
                className="ml-1 hover:text-purple-900"
              >
                <RxCross1 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Transaction Cards */}
        <div className="space-y-4">
          {isLoading ? (
            // Show 3 skeleton cards while loading
            [...Array(3)].map((_, index) => (
              <TransactionSkeleton key={index} />
            ))
          ) : filteredHistory.length > 0 ? (
            <>
              {filteredHistory.map((transaction, index) => (
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
                          {transaction.serviceDate !== null ? (
                            <>
                              <p className="text-gray-500">Service Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(transaction.serviceDate).toLocaleDateString('en-GB') || "N/A"}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-gray-500">Donation Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(transaction.createdAt).toLocaleDateString('en-GB') || "N/A"}
                              </p>
                            </>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-medium text-gray-900">₹{transaction.price}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-2">
                          {transaction.posUser == null? (
                            <>
                              <div>
                                <p className="text-gray-500">Transaction ID</p>
                                <p className="font-medium text-gray-900 truncate">{transaction.transactionId}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Paid via</p>
                                <p className="font-medium text-gray-900">{transaction.paymentMode}</p>
                              </div>
                            </>
                          ):(
                            <>
                              <div>
                                <p className="text-gray-500">Paid Via</p>
                                <p className="font-medium text-gray-900">POS User</p>
                              </div>
                              <div>
                                <p className="text-gray-500">POS Contact</p>
                                <p className="font-medium text-gray-900">{transaction.posUser.phone}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}

                  </div>
                </div>
              ))}
              <Pagination />
            </>
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

// Helper function to debounce search
function debounce<T>(
  func: (arg: T) => void,
  waitFor: number
): (arg: T) => Promise<void> {
  let timeout: NodeJS.Timeout;

  return (arg: T): Promise<void> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        func(arg);
        resolve();
      }, waitFor);
    });
}

export default TransactionsPage;