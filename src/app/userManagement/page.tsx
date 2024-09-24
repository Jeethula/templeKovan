"use client"

import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRouter } from 'next/navigation';
import { ColDef } from 'ag-grid-community';

const PersonalInfoGrid = () => {
  const router = useRouter();
  const [rowData,setRowData]=useState([])


  const fetchData=async()=>{
    const res = await fetch('/api/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data=await res.json()
      console.log(data.details);
      
      setRowData(data.details)
      console.log(rowData);
      
  }

  useEffect(() => {
    fetchData();
  }, [])

  const paginationPageSize =8;
  const paginationPageSizeSelector = [8,16,24,32,40,48,56,64,72,80];

  const columnDefs: ColDef[] = [
    { headerName: "ID", field: "id", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Address 1", field: "address1", sortable: true, filter: true },
    { headerName: "Address 2", field: "address2", sortable: true, filter: true },
    { headerName: "State", field: "state", sortable: true, filter: true },
    { headerName: "Phone Number", field: "phoneNumber", sortable: true, filter: true },
    { headerName: "Country", field: "country", sortable: true, filter: true },
    { headerName: "First Name", field: "firstName", sortable: true, filter: true },
    { headerName: "Last Name", field: "lastName", sortable: true, filter: true },
    { headerName: "Pincode", field: "pincode", sortable: true, filter: true },
    { headerName: "City", field: "city", sortable: true, filter: true },
    { headerName: "Avatar URL", field: "avatarUrl", sortable: true, filter: true },
    { headerName: "Old Record", field: "oldRecord", sortable: true, filter: true },
    { headerName: "Salutation", field: "salutation", sortable: true, filter: true },
    { headerName: "Comments", field: "comments", sortable: true, filter: true },
    { headerName: "Created At", field: "createdAt", sortable: true, filter: true },
    { headerName: "Updated At", field: "updatedAt", sortable: true, filter: true },
    { headerName: "Is Approved", field: "isApproved", sortable: true, filter: true },
  ];


  const onRowClicked = (event: any) => {
    const selectedId = event.data.id; 
    router.push(`userManagement/${selectedId}`)
  };

  return (
    <div className="ag-theme-alpine" style={{ height: '85vh', width: '100%' }}>
      <AgGridReact 
        columnDefs={columnDefs} 
        rowData={rowData} 
        pagination={true} 
        onRowClicked={onRowClicked}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector} 
      />
    </div>
  );
};

export default PersonalInfoGrid;
