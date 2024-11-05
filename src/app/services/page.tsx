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
import { AiOutlinePrinter } from 'react-icons/ai';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ColDef } from 'ag-grid-community';
import  UseApprovedByData  from '../../utils/UseApprovedByData';


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
  rowData: History; 
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
          <Text style={styles.value}>{rowData.nameOfTheService}</Text>
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





type History = {
  nameOfTheService: string;
  description: string;
  paymentMode: string;
  transactionId: string;
  serviceDate: Date;
  price: string;
  approvedBy: string;
  status: string;
};



const ServicesPage: React.FC = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<History[]>([]);
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


  const handleSubmitSuccess = async () => {
    await fetchHistory();
  };

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

  // const printCellRenderer = (params: { data: History }) => (
  //   <PDFDownloadLink
  //     document={<MyDocument rowData={params.data} userData={sessionData} />}
  //     fileName="Service_Details.pdf"
  //   >
  //     <button className="text-blue-500 hover:text-blue-700">
  //       <AiOutlinePrinter size={18} />
  //     </button>
  //   </PDFDownloadLink>
  // );

  const printCellRenderer = (params: { data: History }) => {
 
    const approvedByData = UseApprovedByData(params.data.approvedBy);

    return (
      <PDFDownloadLink
        document={<MyDocument rowData={params.data} userData={sessionData} approvedByData={approvedByData || { firstName: 'Not Approved Yet', lastName: '', phoneNumber: '' }} />}
        fileName="Service_Details.pdf"
      >
        <button className="text-blue-500 hover:text-blue-700">
          <AiOutlinePrinter size={18} />
        </button>
      </PDFDownloadLink>
    );
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
    { headerName: 'Approved By', field: 'approvedBy', sortable: true, filter: true, hide: true },
    { headerName: 'Print', cellRenderer: printCellRenderer, width: 80 }
    
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-[#fdf0f4]">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard
          title="Donation"
          imageSrc='https://www.mygoldguide.in/sites/default/files/styles/single_image_story_header_image/public/The%20Sacred%20Daan%20%28donation%29%20of%20Gold.jpg?itok=6Nc--uvy'
          description="Support our temple with your generous donations."
          modalComponent={<DonationModal onSubmitSuccess={handleSubmitSuccess} />}
        />
        <ServiceCard
          title="Thirumanjanam"
          imageSrc="https://i.ytimg.com/vi/OzEJnTs_bqU/maxresdefault.jpg"
          description="Participate in the sacred bathing ritual of the deity."
          modalComponent={<ThirumanjanamModal onSubmitSuccess={handleSubmitSuccess} />}
        />
        <ServiceCard
          title="Abisekam"
          imageSrc="https://chinnajeeyar.org/wp-content/uploads/2016/11/15032201_10154073675297205_4908543132323661187_n.jpg"
          description="Take part in the divine anointment ceremony."
          modalComponent={<AbisekamModal onSubmitSuccess={handleSubmitSuccess} />}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your History</h2>
        <select
          className="block w-40  px-2 py-2 border border-gray-300 rounded-md text-gray-400"
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