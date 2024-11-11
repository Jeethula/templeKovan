'use client'
import React, { useState, useEffect } from 'react';
import {  BookDown, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export interface ReportFilters {
    reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
    startDate: Date;
    endDate: Date;
    serviceId?: string;
    posUserId?: string;
}

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

const DailyDatePicker = ({ date, onDateChange }: { date: Date, onDateChange: (date: Date) => void }) => {
    return (
        <div className="flex flex-col gap-2">
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
    const [date] = useState<Date>(new Date());
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    useEffect(() => {
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

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const params = new URLSearchParams({
                reportType: filters.reportType,
                serviceId: selectedService === 'all' ? '' : selectedService,
                posUserId: selectedPosUser === 'all' ? '' : selectedPosUser,
                date: today.toISOString()
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
        const today = new Date();

        switch (filters.reportType) {
            case 'daily':
                return (
                    <div className="flex flex-col gap-2">
                        <DailyDatePicker
                            date={filters.startDate}
                            onDateChange={handleDailyDateChange}
                        />
                    </div>
                );

            case 'weekly':
                const weekStart = new Date(today.setDate(today.getDate() - 7));
                return (
                    <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm">
                        {format(weekStart, "PPP")} - {format(new Date(), "PPP")}
                    </div>
                );

            case 'monthly':
                const monthStart = new Date(today.setDate(today.getDate() - 30));
                return (
                    <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm">
                        {format(monthStart, "PPP")} - {format(new Date(), "PPP")}
                    </div>
                );

            case 'custom':
                return (
                    <div className="grid gap-2">
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                        {format(dateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                        <DatePicker
                            date={dateRange?.from || date}
                            onDateChange={(newDate) => setDateRange({ from: newDate, to: dateRange?.to })}
                        />
                    </div>
                );
        }
    };

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
                <div className="grid grid-cols-2 gap-4">
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
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Service</th>
                                        <th className="px-6 py-3">POS User</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(reportData.services) && reportData.services.map((service) => (
                                        <tr key={service.id} className="bg-white border-b">
                                            <td className="px-6 py-4">
                                                {new Date(service.serviceDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">{service.nameOfTheService?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{service.posUser?.email || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    service.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        service.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {service.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">₹{service.price || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="bg-[#fdf0f4] container min-h-screen min-w-screen mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl flex items-center gap-x-2 text-[#663399] font-bold"> <BookDown/>Reports</h1>
                <Button
                    onClick={exportToCSV}
                    disabled={!reportData}
                    className="flex items-center gap-2 bg-[#663399] text-white"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Tabs value={filters.reportType} onValueChange={(value: string) => setFilters(prev => ({ ...prev, reportType: value as 'daily' | 'weekly' | 'monthly' | 'custom' }))}>
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="daily">Daily</TabsTrigger>
                                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                    <TabsTrigger value="custom">Custom</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div>
                            {renderDateSelector()}
                        </div>

                        <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger>
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

                        <Select value={selectedPosUser} onValueChange={setSelectedPosUser}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select POS User" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All POS Users</SelectItem>
                                {posUsers.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.personalInfo?.firstName} {user.personalInfo?.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <button
                            className="md:col-span-4 p-3 rounded-xl bg-[#663399] text-white"
                            onClick={fetchReportData}
                        >
                            Generate Report
                        </button>
                    </div>
                </CardContent>
            </Card>

            {renderReportContent()}
        </div>
    );
}






