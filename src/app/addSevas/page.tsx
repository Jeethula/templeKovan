"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import toast from "react-hot-toast";

interface Service {
    id: string;
    name: string;
    description: string;
    image: string;
    targetDate: string;
    targetPrice: number;
    minAmount: number;
    maxCount: number;
    isActive: boolean;
}

const ServiceSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-[#663399]/20 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="flex space-x-2">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default function AddSevas() {
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
        image?: string;
    }>({});

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        targetDate: '',
        targetPrice: '',
        minAmount: '',
        maxCount: ''
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/services/addservices');
            if (!response.ok) throw new Error('Failed to fetch services');
            const data = await response.json();
            setServices(data.services)
        } catch (error) {
            console.error(error);
            toast.error('Error fetching services');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFormData(prev => ({
                ...prev,
                image: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validationErrors: {
            name?: string;
            description?: string;
            image?: string;
        } = {};
        
        if (!formData.name.trim()) {
            validationErrors.name = 'Service name is required';
        }
        if (!formData.description.trim()) {
            validationErrors.description = 'Description is required';
        }
        if (!formData.image) {
            validationErrors.image = 'Image is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const formattedData = {
                ...formData,
                targetPrice: Number(formData.targetPrice),
                minAmount: Number(formData.minAmount),
                maxCount: Number(formData.maxCount),
            };

            const response = await fetch('/api/services/addservices', {
                method: modalMode === 'create' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    modalMode === 'edit' 
                        ? { ...formattedData, id: selectedService?.id } 
                        : formattedData
                ),
            });

            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save service');
            }
            
            toast.success(`Service ${modalMode === 'create' ? 'created' : 'updated'} successfully!`);
            setIsModalOpen(false);
            fetchServices();
            resetForm();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error saving service');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const response = await fetch(`/api/services/addservices?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete service');
            
            toast.success('Service deleted successfully');
            fetchServices();
        } catch (error) {
            console.error(error);
            toast.error('Error deleting service');
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({
            name: '',
            description: '',
            image: '',
            targetDate: '',
            targetPrice: '',
            minAmount: '',
            maxCount: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        setModalMode('edit');
        setSelectedService(service);
        setFormData({
            name: service.name,
            description: service.description,
            image: service.image,
            targetDate: service.targetDate,
            targetPrice: String(service.targetPrice),
            minAmount: String(service.minAmount),
            maxCount: String(service.maxCount)
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            image: '',
            targetDate: '',
            targetPrice: '',
            minAmount: '',
            maxCount: ''
        });
    };

    return (
        <div className="min-h-screen bg-[#fdf0f4]">
            <div className="px-4 max-w-3xl mx-auto pb-5 pt-5">
                <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#663399]">Manage Seva</h1>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center bg-[#663399] hover:bg-[#663399]/90 h-12 rounded-xl shadow-sm
                                     hover:shadow-md transition-all duration-200 text-white px-4 py-2"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add New Seva
                    </button>
                </div>

                {/* Services List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <>
                            <ServiceSkeleton />
                            <ServiceSkeleton />
                            <ServiceSkeleton />
                        </>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white rounded-xl p-6 shadow-sm border border-[#663399]/20 hover:shadow-md
                                             transition-all duration-200"
                            >
                                {/* Service card content */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg text-[#663399]">{service.name}</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(service)}
                                            className="hover:bg-[#663399]/10"
                                        >
                                            <Edit className="h-5 w-5 text-[#663399]" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="hover:bg-red-50"
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                                
                                {service.image && (
                                    <div className="mb-4 rounded-lg overflow-hidden">
                                        <img 
                                            src={service.image} 
                                            alt={service.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
                    <div className="bg-[#663399] text-white p-6">
                        <h2 className="text-2xl font-bold">
                            {modalMode === 'create' ? 'Add New Service' : 'Edit Service'}
                        </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-4">
                            {/* Name field */}
                            <div className="relative">
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter service name *"  
                                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border 
                                        ${errors.name ? 'border-red-500' : ''}`}
                                    required
                                />
                                <Label htmlFor="name" className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">
                                    Service Name *
                                </Label>
                                {errors.name && (
                                    <span className="text-red-500 text-xs mt-1">{errors.name}</span>
                                )}
                            </div>

                            {/* Description field */}
                            <div className="relative">
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description *"
                                    className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border 
                                        ${errors.description ? 'border-red-500' : ''}`}
                                    required
                                />
                                <Label htmlFor="description" className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">
                                    Description *
                                </Label>
                                {errors.description && (
                                    <span className="text-red-500 text-xs mt-1">{errors.description}</span>
                                )}
                            </div>

                            {/* Target Date field */}
                            <div className="relative">
                                <Input
                                    id="targetDate"
                                    type="date"
                                    value={formData.targetDate}
                                    onChange={handleInputChange}
                                    placeholder="Select target date (optional)"
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border"
                                />
                                <Label htmlFor="targetDate" className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">
                                    Target Date
                                </Label>
                            </div>

                            {/* Target Price field */}
                            <div className="relative">
                                <Input
                                    id="targetPrice"
                                    type="number"
                                    value={formData.targetPrice}
                                    onChange={handleInputChange}
                                    placeholder="Enter target price (optional)"
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border"
                                />
                                <Label htmlFor="targetPrice" className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">
                                    Target Price (₹)
                                </Label>
                            </div>

                            {/* Min Amount field */}
                            <div className="relative">
                                <Input
                                    id="minAmount"
                                    type="number"
                                    value={formData.minAmount}
                                    onChange={handleInputChange}
                                    placeholder="Enter minimum amount (optional)"
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border"
                                />
                                <Label htmlFor="minAmount" className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">
                                    Minimum Amount (₹)
                                </Label>
                            </div>

                            {/* Max Count field */}
                            <div className="relative">
                                <Input
                                    id="maxCount"
                                    type="number"
                                    value={formData.maxCount}
                                    onChange={handleInputChange}
                                    placeholder="Enter maximum count (optional)"
                                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border"
                                />
                                <Label htmlFor="maxCount" className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">
                                    Maximum Count
                                </Label>
                            </div>

                            {/* Add Image Upload field */}
                            <div className="relative">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={`block w-full text-sm ${errors.image ? 'border-red-500' : ''}`}
                                    required
                                />
                                <Label htmlFor="image" className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-1">
                                    Image *
                                </Label>
                                {errors.image && (
                                    <span className="text-red-500 text-xs mt-1">{errors.image}</span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#663399] hover:bg-[#663399]/90 h-12 rounded-xl text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : modalMode === 'create' ? 'Create Service' : 'Update Service'}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}