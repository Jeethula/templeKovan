"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import CustomFilter from './CustomFilter';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRouter } from 'next/navigation';
import { ColDef } from 'ag-grid-community';
import { Clock } from 'lucide-react';
import './style.css';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import { FaUsersGear } from 'react-icons/fa6';
import {  RowClickedEvent } from 'ag-grid-community';

type PersonalInfo = {
  userid: string;
  firstName: string;
  lastName: string;
  city: string;
  createdAt: string;
  isApproved: string;
  address1: string;
  address2: string;
  pincode: string;
  state: string;
  country: string;
  comments: string;
  avatarUrl: string;
  [key: string]: string;
};

type UserDetail = {
  id: string;
  email?: string;
  role?: string;
  phone?: string;
};

const PersonalInfoGrid: React.FC = () => {
  const router = useRouter();
  const [rowData, setRowData] = useState([]);
  const [showAllData, setShowAllData] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      const combinedData = data.personalInfodetails.map((personal: PersonalInfo) => {
        const userDetail = data.userDetails.find((user: UserDetail) => user.id === personal.userid);
        return {
          ...personal,
          email: userDetail?.email,
          role: userDetail?.role,
          Phone: userDetail?.phone
        };
      });
      setRowData(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log(sessionData);
    
    if (!sessionData.role.includes('Admin') ) {
      router.push('/unAuthorized');
    }
    fetchData();

    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  console.log(rowData);
  
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50, 100];

  const statusCellRenderer = (params: { value: string }) => {

    if (params.value === 'PENDING') {
      return (
        <div className='flex justify-left items-center text-yellow-500 font-bold'>
          <Clock size={16} style={{ marginRight: '4px' }} />
          Pending
        </div>
      );
    }
    if (params.value === 'REJECTED') {
      return (
        <div className='flex justify-left items-center text-red-500 font-bold'>
          <RxCross1 size={16} style={{ marginRight: '4px' }} />
          Rejected
        </div>
      );
    }
    if (params.value === 'APPROVED') {
      return (
        <div className='flex justify-left items-center text-green-500 font-bold'>
          <IoCheckmarkDone size={20} style={{ marginRight: '4px' }} />
          Approved
        </div>
      );
    }
    return params.value;
  };

  const allColumnDefs: ColDef[] = [
    {
      headerName: "Full Name",
      valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`,
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { fontWeight: '500', textAlign: 'left' }
    },
    {
      headerName: "Address 1",
      field: "address1",
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "Address 2",
      field: "address2",
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "City",
      field: "city",
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      flex: 1,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "Phone",
      field: "Phone",
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      flex: 1,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "Created At",
      field: "createdAt",
      sortable: true,
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString()
      },
      flex: 2,
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: "Status",
      field: "isApproved",
      sortable: true,
      filter:CustomFilter,
      filterParams:{
        values:['approved','rejected','pending']
      },
      floatingFilter: true,
      cellRenderer: statusCellRenderer,
      flex: 1,
    },
    {
      headerName: "Pincode",
      field: "pincode",
      sortable: true,
      floatingFilter: true,
      filter: 'agNumberColumnFilter',
      flex: 1,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "State",
      field: "state",
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "Country",
      field: "country",
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "Comments",
      field: "comments",
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
    {
      headerName: "Avatar URL",
      field: "avatarUrl",
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'left', fontWeight: 'normal' }
    },
  ];
  
  const defaultColDef = useMemo(() => ({
    flex:2,
    minWidth:200,
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const onRowClicked = (event: RowClickedEvent) => {
    const selectedId = event.data.userid;
    router.push(`userManagement/${selectedId}`);
  }

  const getColumnDefs = () => {
    if (showAllData) {
      return allColumnDefs;
    } else if (isSmallDevice) {
      return allColumnDefs.filter(col => col.headerName && ['Full Name', 'Phone','Created At', 'Status'].includes(col.headerName));
    } else {
      return allColumnDefs.filter(col => col.headerName && ['Full Name', 'Address 2', 'Address 1', 'City', 'Phone', 'Status'].includes(col.headerName));
    }
  };

  return (
    <div className='bg-[#fdf0f4] h-full w-full min-h-screen min-w-screen'>
      <div className="pt-5 flex flex-col items-center gap-y-5 justify-center">
        <div className='flex w-full items-center justify-between gap-y-5 px-3'>
          <h1 className='text-2xl font-medium text-red-500 flex items-center gap-x-3'><FaUsersGear />Manage Users </h1>
        <button
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-md mb-4"
          onClick={() => setShowAllData(!showAllData)}
        >
          {showAllData ? 'View Less Data' : 'View All Data'}
        </button>
        </div>

        <div className="ag-theme-alpine" style={{ height: '80%', width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={getColumnDefs()}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            onRowClicked={onRowClicked}
            rowClassRules={{
              'hover:bg-blue-50 cursor-pointer': () => true,
            }}
            headerHeight={48}
            rowHeight={45}
            domLayout="autoHeight"
            animateRows={true}
            enableCellTextSelection={true}
            suppressMovableColumns={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoGrid;
