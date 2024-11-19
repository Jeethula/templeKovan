'use client'
import React, { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    // createColumnHelper,
    ColumnDef,
    getPaginationRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table';
import {  BookDown, Download, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";
// import { cn } from "@/lib/utils";
// import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Table } from '@tanstack/react-table'

export interface ReportFilters {
    reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
    startDate: Date;
    endDate: Date;
    serviceId?: string;
    posUserId?: string;
}

// type ColumnValue = string | number | Date | null;

export interface ServiceStats {
    serviceName: string;
    count: number;
    totalAmount: number;
    averageAmount: number;
}

export interface PosUserStats {
    userId: string;
    email: string;
    name: string;
    servicesCount: number;
    totalAmount: number;
    averageAmount: number;
}

export interface DailyTrend {
    date: Date;
    totalServices: number;
    totalAmount: number;
}

export interface ReportData {
    services: Array<{
        id: string;
        createdAt: Date;
        serviceDate: Date;
        nameOfTheService: {
            name: string;
        };
        description: string;
        price: number;
        status: string;
        posUser?: {
            email: string;
            personalInfo?: {
                firstName: string;
                lastName: string;
            };
        };
    }>;
    totalAmount: number;
    totalServices: number;
    serviceBreakdown: Record<string, {
        count: number;
        totalAmount: number;
    }>;
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
}

// Add this validation function at the top level
// const isDateInFuture = (date: Date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date > today;
// };

// const columnHelper = createColumnHelper<ReportData['services'][number]>();
// Add this type definition at the top with other interfaces

interface TableFiltersProps {
  table: Table<ReportData['services'][number]>;
  data: ReportData['services'];
}

// Update the TableFilters component definition
const TableFilters = ({ table, data }: TableFiltersProps) => {
    const uniqueServices = Array.from(new Set(data.map(item => item.nameOfTheService.name)));

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
            <Select
                value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
                onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)}
            >
                <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
            </Select>

            <div className="w-full md:w-auto">
                <DatePicker
                    date={table.getColumn('createdAt')?.getFilterValue() as Date}
                    onDateChange={(date) => table.getColumn('createdAt')?.setFilterValue(date)}
                />
            </div>

            <Select
                value={(table.getColumn('service')?.getFilterValue() as string) ?? 'all'}
                onValueChange={(value) => table.getColumn('service')?.setFilterValue(value === 'all' ? '' : value)}
            >
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter service..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {uniqueServices.map((service) => (
                        <SelectItem key={service} value={service}>
                            {service}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            
            <Select
                value={(table.getColumn('posUser')?.getFilterValue() as string) ?? 'all'}
                onValueChange={(value) => table.getColumn('posUser')?.setFilterValue(value === 'all' ? '' : value)}
            >
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter POS User..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {Array.from(new Set(data.map(item => item.posUser?.email))).filter(Boolean).map((email) => (
                        <SelectItem key={email} value={email || ''}>
                            {email}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <input
                type="text"
                placeholder="Search..."
                value={(table.getColumn('search')?.getFilterValue() as string) ?? ''}
                onChange={(e) => table.getColumn('search')?.setFilterValue(e.target.value)}
                className="w-full md:w-[250px] p-2 border rounded"
            />

        </div>
    );
};

// First, define proper interface for the service data structure
interface ServiceData {
  id: string;
  serviceDate: string | Date;
  createdAt: string | Date;
  nameOfTheService: {
    name: string;
  };
  description: string;
  price: number;
  status: string;
  posUser?: {
    email: string;
    personalInfo?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

// Update the column definitions with proper typing
const columns: ColumnDef<ServiceData>[] = [
    {
        id: 'createdAt', // Change from 'date' to 'createdAt'
        accessorFn: (row) => new Date(row.createdAt),
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Booked On
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: (info) => (info.getValue() as Date)?.toLocaleDateString('en-GB'),
        filterFn: (row, id, value: Date) => {
            if (!value) return true;
            const rowDate = row.getValue(id) as Date;
            const filterDate = new Date(value);
            return rowDate.toLocaleDateString('en-GB') === filterDate.toLocaleDateString('en-GB');
        }
    },
    {
        id: 'serviceDate',
        accessorFn: (row) => new Date(row.serviceDate),
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Seva Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: (info) => (info.getValue() as Date)?.toLocaleDateString('en-GB'),
        filterFn: (row, id, value: Date) => {
            if (!value) return true;
            const rowDate = row.getValue(id) as Date;
            const filterDate = new Date(value);
            return rowDate.toLocaleDateString('en-GB') === filterDate.toLocaleDateString('en-GB');
        }
    },
    {
        id: 'service',
        accessorFn: (row) => row.nameOfTheService?.name,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Service
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        filterFn: (row, id, value: string) => {
            if (!value) return true;
            const rowValue = row.getValue(id) as string;
            return rowValue.toLowerCase().includes(value.toLowerCase());
        }
    },
    {
        id: 'posUser',
        accessorFn: (row) => row.posUser?.email,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                POS User
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: (info) => info.getValue() || 'N/A',
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: (info) => (
            <span className={`px-2 py-1 rounded text-xs ${
                info.getValue() === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                info.getValue() === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
                {info.getValue() as string}
            </span>
        ),
        filterFn: 'equals'
    },
    {
        id: 'price',
        accessorKey: 'price',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: (info) => `₹${info.getValue() || 0}`,
        filterFn: (row, id, value: number) => {
            if (!value) return true;
            const rowValue = row.getValue(id) as number;
            return rowValue >= value;
        }
    }
];

const DailyDatePicker = ({ date, onDateChange }: { date: Date, onDateChange: (date: Date) => void }) => {
    return (
        <div className="w-full">
            <DatePicker
                date={date}
                onDateChange={onDateChange}
            />
        </div>
    );
};

export default function ReportsPage() {
    const [filters, setFilters] = useState<ReportFilters>({
        reportType: 'daily',
        startDate: new Date(),
        endDate: new Date(),
    });

    const handleDailyDateChange = (date: Date) => {
        setFilters(prev => ({
            ...prev,
            startDate: date,
            endDate: date
        }));
    };

    const [selectedDate] = useState(new Date());
    const [selectedService, setSelectedService] = useState('');
    const [selectedPosUser, setSelectedPosUser] = useState('');
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
    const [posUsers, setPosUsers] = useState<Array<{ id: string; email: string; personalInfo?: { firstName?: string; lastName?: string } }>>([]);
    // const [date] = useState<Date>(new Date());
    // const [dateRange, setDateRange] = useState<DateRange | undefined>({
    //     from: new Date(),
    //     to: new Date(),
    // });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const router = useRouter();

    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (!sessionData.role?.includes('posuser') && !sessionData.role?.includes('Admin') && !sessionData.role?.includes('superadmin')) {
          router.push('/unAuthorized');
        }
        fetchServices();
        fetchPosUsers();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services/list');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchPosUsers = async () => {
        try {
            const response = await fetch('/api/services/user/pos');
            const data = await response.json();
            setPosUsers(data);
        } catch (error) {
            console.error('Error fetching POS users:', error);
        }
    };

    console.log('reportData:', reportData);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const today = new Date(filters.startDate.getTime() - filters.startDate.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];

            const params = new URLSearchParams({
                reportType: filters.reportType,
                serviceId: selectedService === 'all' ? '' : selectedService,
                posUserId: selectedPosUser === 'all' ? '' : selectedPosUser,
                date: today
            });

            const response = await fetch(`/api/reports?${params}`);
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const convertToCSV = (data: ReportData) => {
        const headers = ['Date', 'Service', 'POS User', 'Status', 'Amount'];
        const rows = data.services.map((service: ReportData['services'][number]) => [
            new Date(service.serviceDate).toLocaleDateString(),
            service.nameOfTheService.name,
            service.posUser?.email || 'N/A',
            service.status,
            service.price
        ]);
        return [headers.join(','), ...rows.map((row: (string | number)[]) => row.join(','))].join('\n');
    };

    const exportToCSV = () => {
        if (!reportData) return;

        const csvContent = convertToCSV(reportData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${filters.reportType}-${selectedDate.toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const renderDateSelector = () => {
        switch (filters.reportType) {
            case 'weekly':
                // Get current date
                const currentDate = new Date(filters.startDate);
                // Get Sunday (start) of the week
                const weekStart = new Date(currentDate);
                weekStart.setDate(currentDate.getDate() - currentDate.getDay());
                weekStart.setHours(0, 0, 0, 0);
                // Get Saturday (end) of the week
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                weekEnd.setHours(23, 59, 59, 999);
                
                return (
                    <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm w-full overflow-x-auto">
                        <span className="whitespace-nowrap">
                            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                        </span>
                    </div>
                );

            case 'daily':
                return (
                    <div className="flex flex-col gap-2">
                        <DailyDatePicker
                            date={filters.startDate}
                            onDateChange={handleDailyDateChange}
                        />
                    </div>
                );

            case 'monthly':
                // Get current date
                const monthDate = new Date(filters.startDate);
                // Set to first day of month
                const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                monthStart.setHours(0, 0, 0, 0);
                // Set to last day of month
                const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
                monthEnd.setHours(23, 59, 59, 999);
                
                return (
                    <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm w-full overflow-x-auto">
                        <span className="whitespace-nowrap">
                            {format(monthStart, "MMM d")} - {format(monthEnd, "MMM d, yyyy")}
                        </span>
                    </div>
                );

            default:
                return null;
        }
    };

    const table = useReactTable<ReportData['services'][number]>({
        data: reportData?.services || [],
        columns: columns as ColumnDef<ReportData['services'][number]>[],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnFilters,
            sorting,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
    });

    const renderReportContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        if (!reportData || !reportData.services) {
            return (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    Select filters and generate report
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{reportData.totalServices || 0}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Amount</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">₹{reportData.totalAmount || 0}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Services Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TableFilters table={table} data={reportData.services} />
                        <div className="relative overflow-x-auto">
                            <div className="min-w-full overflow-x-auto">
                                <table className="w-full text-sm text-left border">
                                    <thead className="text-xs uppercase bg-gray-50">
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <th key={header.id} className="px-6 py-3 font-medium text-gray-900">
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map(row => (
                                            <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
                                <div className="text-sm text-gray-500 text-center md:text-left">
                                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                    {Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        table.getFilteredRowModel().rows.length
                                    )}{' '}
                                    of {table.getFilteredRowModel().rows.length} results
                                </div>
                                <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="w-full md:w-auto"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="w-full md:w-auto"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="bg-[#fdf0f4] min-h-screen w-full p-6 space-y-6 overflow-x-hidden">
            <div className="flex justify-between items-center">
                <h1 className="text-xl flex items-center gap-x-2 text-[#663399] font-bold"> <BookDown/>Reports</h1>
                <Button
                    onClick={exportToCSV}
                    disabled={!reportData}
                    className="flex items-center gap-2 bg-[#663399] hover:bg-violet-600 text-white"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Type Selection - Full width on small, half on medium */}
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                            <Tabs value={filters.reportType} onValueChange={(value: string) => setFilters(prev => ({ ...prev, reportType: value as 'daily' | 'weekly' | 'monthly' | 'custom' }))}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="daily">Daily</TabsTrigger>
                                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                    {/* <TabsTrigger value="custom">Custom</TabsTrigger> */}
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Date Selector - Full width on small, half on medium */}
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                            {renderDateSelector()}
                        </div>

                        {/* Service Select - Full width on small, half on medium */}
                        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
                            <Select value={selectedService} onValueChange={setSelectedService}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Services</SelectItem>
                                    {services.map((service) => (
                                        <SelectItem key={service.id} value={service.id}>
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* POS User Select - Full width on small, half on medium */}
                        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
                            <Select value={selectedPosUser} onValueChange={setSelectedPosUser}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select POS User" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    {posUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.personalInfo?.firstName} {user.personalInfo?.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Generate Report Button - Full width on mobile, right-aligned on md and above */}
                        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex md:justify-end">
                            <button
                                className="md:w-fit w-full rounded-xl bg-[#663399] hover:bg-violet-600 text-white p-3 md:px-6 md:py-3"
                                onClick={fetchReportData}
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {renderReportContent()}
        </div>
    );
}

