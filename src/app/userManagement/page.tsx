"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRouter } from 'next/navigation';
import { ColDef } from 'ag-grid-community';
import { Check, Clock } from 'lucide-react';
import './style.css';

const PersonalInfoGrid = () => {
  const router = useRouter();
  const [rowData, setRowData] = useState([]);

  const fetchData = async () => {
    const res = await fetch('/api/profile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setRowData(data.details);
  };

  useEffect(() => {
    fetchData();
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
          <Clock size={14} style={{marginRight: '4px'}} />
          Pending
        </div>
      );
    }
    if (params.value === 'approved') {
      return (
          <div className='flex justify-center items-center text-green-500 font-bold'>
          <Check size={14} style={{marginRight: '4px'}} />
          Approved
          </div>
      );
    }
    return params.value;
  };
  const columnDefs: ColDef[] = [
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
        return new Date(params.value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
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
      flex: 1
    },
  ];
  

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
  }), []);

  const onRowClicked = (event: any) => {
    const selectedId = event.data.id;
    router.push(`userManagement/${selectedId}`);
  };

  return (
    <div className=" mt-5 flex items-center justify-center ">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg ">
        <div className="ag-theme-alpine" style={{ height: '50%', width: '50%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            onRowClicked={onRowClicked}
            rowClassRules={{
              'hover:bg-blue-50 cursor-pointer': () => true,
            }}
            headerHeight={48}
            rowHeight={56}
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