"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ValueGetterParams, ColDef } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { Clock } from 'lucide-react';
import { FaUsersGear } from 'react-icons/fa6';
import CustomFilter from  './CustomFilter'
import CustomServiceFilter from './CustomServiceFilter'
import '../userManagement/style.css';
import UseApprovedByData from '../../utils/UseApprovedByData'
import { AiOutlinePrinter } from 'react-icons/ai';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


type Service = {
    price: number;
    id: string;
    personalInfo: PersonalInfo;
    nameOfTheService: string;
    description: string;
    paymentMode: string;
    transactionId: string;
    amount: number;
    serviceDate: string;
    approvedBy: string;
    status: string;
}

type PersonalInfo={
    firstName:string;
    lastName:string;
    phoneNumber:string;
}


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
            <Text style={styles.value}>₹{rowData.amount}</Text>
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

const ServiceGrid = () => {
    const [rowData, setRowData] = useState([]);
    const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
    const userId: string = sessionData.id;
    const router = useRouter();
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

    const printCellRenderer = (params: { data:Service }) => {
 
        const approvedByData = UseApprovedByData(params.data.approvedBy);
        console.log(params.data.approvedBy);
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

    const columnDefs: ColDef[] = [
        { headerName: 'Service Name', field: 'nameOfTheService',
            filter: CustomServiceFilter,
            floatingFilter: true, 
            filterParams: {
                values: ['abhisekam','donation','thirumanjanam']
            },
            cellStyle: { textAlign: 'left', fontWeight: 'normal' }
         },
         { 
            headerName: 'Service Date',
            field: 'serviceDate',
            floatingFilter: true,
            cellStyle: { textAlign: 'left', fontWeight: 'normal' },
            valueFormatter: (params) => {
                const date = new Date(params.value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              }
         },
         { headerName: 'Amount', field: 'amount',floatingFilter: true,cellStyle: { textAlign: 'left', fontWeight: 'normal' } },
        { 
            headerName: 'Name', 
            field: 'name', 
            floatingFilter: true,
            valueGetter: (params: ValueGetterParams) => `${params.data.firstName} ${params.data.lastName}`,
            cellStyle: { textAlign: 'left', fontWeight: 'normal' } 
        },
        { 
            headerName: 'Phone No', 
            field: 'phoneNo', 
            floatingFilter: true,
            valueGetter: (params: ValueGetterParams) => params.data.phoneNo,
            cellStyle: { textAlign: 'left', fontWeight: 'normal' } 
        },
        { 
            headerName: 'Status', 
            field: 'status', 
            cellRenderer: statusCellRenderer,  
            filter: CustomFilter,
            floatingFilter: true, 
            filterParams: {
                values: ['APPROVED', 'REJECTED', 'PENDING']  
            },
            cellStyle: { textAlign: 'left', fontWeight: 'normal' }
        },
        {
            headerName:'Approved By',
            field:'approvedBy',
            cellStyle: { textAlign: 'left', fontWeight: 'normal' },
            hide:true

        },
        {
            headerName: 'Description',
            field: 'description',
            cellStyle: { textAlign: 'left', fontWeight: 'normal' },
            hide:true
        },
        {
            headerName: 'Payment Mode',
            field: 'paymentMode',
            cellStyle: { textAlign: 'left', fontWeight: 'normal' },
            hide:true
        },
        {
            headerName: 'Transaction Id',
            field: 'transactionId',
            cellStyle: { textAlign: 'left', fontWeight: 'normal' },
            hide:true
        },
        {
            headerName: 'Print',
            field: 'print',
            flex:0,
            cellRenderer: printCellRenderer,
            cellStyle: { textAlign: 'left', fontWeight: 'normal' }
        }
    ];
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 20, 50, 100];

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (!sessionData.role.includes('approver') ) {
          router.push('/unAuthorized');
        }
        const fetchServices = async () => {
            const response = await fetch(`/api/services/approver?approverId=${userId}`);
            const data = await response.json();
            if (data.status === 200) {
                setRowData(data.services.map((service: Service) => ({
                    id: service.id,
                    firstName: service.personalInfo.firstName,
                    lastName: service.personalInfo.lastName,
                    phoneNo: service.personalInfo.phoneNumber,
                    nameOfTheService: service.nameOfTheService,
                    amount: service.price,
                    description: service.description,
                    paymentMode: service.paymentMode,
                    transactionId: service.transactionId,
                    approvedBy: service.approvedBy,
                    serviceDate: new Date(service.serviceDate).toLocaleDateString(),
                    status: service.status
                })));
            }
        };
        fetchServices();
    }, []);

    const onRowClicked = (params: { data: { id: string } }) => {
        console.log(params);
        
        router.push(`/serviceManagement/${params.data.id}`);
    };

    const defaultColDef = useMemo(() => ({
        flex:2,
        minWidth:200,
        sortable: true,
        filter: true,
        resizable: true,
      }), []);
    return (
        <div className='bg-[#fdf0f4] h-full w-full min-h-screen min-w-screen'>
        <div className="pt-5 flex flex-col items-center gap-y-5 justify-center">
          <div className='flex w-full items-center justify-between gap-y-5 px-3'>
            <h1 className='text-2xl font-bold text-red-500 flex items-center gap-x-3'><FaUsersGear />Manage Services</h1>
        </div>
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                onRowClicked={onRowClicked}
            />
        </div>
        </div>
        </div>
    );
};

export default ServiceGrid;
