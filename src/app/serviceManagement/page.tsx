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


type Service = {
    price: number;
    id: string;
    personalInfo: PersonalInfo;
    nameOfTheService: string;
    amount: number;
    serviceDate: string;
    status: string;
}

type PersonalInfo={
    firstName:string;
    lastName:string;
    phoneNumber:string;
}

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

    const columnDefs: ColDef[] = [
        { headerName: 'Service Name', field: 'nameOfTheService',
            filter: CustomServiceFilter,
            floatingFilter: true, 
            filterParams: {
                values: ['abhisekam','donation','thirumanjanam']
            },
            cellStyle: { textAlign: 'left', fontWeight: 'normal' }
         },
         { headerName: 'Service Date', field: 'serviceDate',floatingFilter: true,cellStyle: { textAlign: 'left', fontWeight: 'normal' } },
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
        }
    ];
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 20, 50, 100];

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
        console.log(sessionData);
        
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
                    serviceDate: new Date(service.serviceDate).toLocaleDateString(),
                    status: service.status
                })));
            }
        };
        fetchServices();
    }, []);

    const onRowClicked = (params: { data: { id: string } }) => {
        console.log(params.data.id);
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
