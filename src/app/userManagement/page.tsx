"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRouter } from 'next/navigation';
import { ColDef } from 'ag-grid-community';
import { Clock } from 'lucide-react';
import './style.css';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';

const PersonalInfoGrid = () => {
  const router = useRouter();
  const [rowData, setRowData] = useState([]);
  const [showAllData, setShowAllData] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  const fetchData = async () => {
    const res = await fetch('/api/profile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setRowData(data.details);
  };

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (sessionData.role !== 'Admin') {
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

  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50, 100];

  const statusCellRenderer = (params: { value: string }) => {
    const statusStyle = {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'fit-content',
      margin: '0 auto',
    };

    if (params.value === 'pending') {
      return (
        <div className='flex justify-center items-center text-yellow-500 font-bold'>
          <Clock size={16} style={{ marginRight: '4px' }} />
          Pending
        </div>
      );
    }
    if (params.value === 'rejected') {
      return (
        <div className='flex justify-center items-center text-red-500 font-bold'>
          <RxCross1 size={16} style={{ marginRight: '4px' }} />
          Rejected
        </div>
      );
    }
    if (params.value === 'approved') {
      return (
        <div className='flex justify-center items-center text-green-500 font-bold'>
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
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { fontWeight: '500', textAlign: 'center' }
    },
    {
      headerName: "Email",
      field: "email",
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "Phone",
      field: "phoneNumber",
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "City",
      field: "city",
      sortable: true,
      filter: 'agSetColumnFilter',
      flex: 1,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "Created At",
      field: "createdAt",
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString()
      },
      flex: 2,
      cellStyle: { textAlign: 'center' }
    },
    {
      headerName: "Status",
      field: "isApproved",
      sortable: true,
      filter: 'agSetColumnFilter',
      cellRenderer: statusCellRenderer,
      flex: 1,
    },
    {
      headerName: "Address 1",
      field: "address1",
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "Address 2",
      field: "address2",
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "Pincode",
      field: "pincode",
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "State",
      field: "state",
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "Country",
      field: "country",
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 1,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "Comments",
      field: "comments",
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
    {
      headerName: "Avatar URL",
      field: "avatarUrl",
      sortable: true,
      filter: 'agTextColumnFilter',
      flex: 2,
      cellStyle: { textAlign: 'center', fontWeight: 'normal' }
    },
  ];
  console.log(showAllData, isSmallDevice, 'showAllData, isSmallDevice');
  
  const defaultColDef = useMemo(() => ({
    flex:2,
    minWidth:200,
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
  }), []);

  const onRowClicked = (event: any) => {
    const selectedId = event.data.id;
    router.push(`userManagement/${selectedId}`);
  };

  const getColumnDefs = () => {
    if (showAllData) {
      return allColumnDefs;
    } else if (isSmallDevice) {
      return allColumnDefs.filter(col => col.headerName && ['Full Name', 'Phone','Created At', 'Status'].includes(col.headerName));
    } else {
      return allColumnDefs.filter(col => col.headerName && ['Full Name', 'Email', 'Phone', 'City', 'Created At', 'Status'].includes(col.headerName));
    }
  };

  return (
    <div className='bg-[#fdf0f4] h-full w-full min-h-screen min-w-screen'>
      <div className="pt-5 flex flex-col items-center gap-y-5 justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          onClick={() => setShowAllData(!showAllData)}
        >
          {showAllData ? 'View Less Data' : 'View All Data'}
        </button>
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