"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type ServiceLimit = {
  id: string;
  thirumanjanam: number;
  abhisekam: number;
  thirumanjanamPrice: number;
  abhisekamPrice: number;
};

const ServiceLimitsPage = () => {
  const [serviceLimits, setServiceLimits] = useState<ServiceLimit[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedServiceLimit, setEditedServiceLimit] = useState<Partial<ServiceLimit> | null>(null);
  const router = useRouter();

  const userSession =
    typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "{}") : {};
  const isApprover = userSession?.role?.includes("approver");

  useEffect(() => {
    if (!isApprover) {
      router.push("/unAuthorized");
    }

    const fetchServiceLimits = async () => {
      try {
        const res = await fetch("/api/servicelimit");
        const data = await res.json();
        setServiceLimits(data.serviceLimits);
      } catch (error) {
        console.error("Error fetching service limits:", error);
        toast.error("Failed to load service limits");
      } 
    };

    fetchServiceLimits();
  }, [isApprover, router]);

  const handleEdit = (serviceLimit: ServiceLimit) => {
    setEditedServiceLimit(serviceLimit);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!editedServiceLimit) return;
    
    try {
      const res = await fetch(`/api/servicelimit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedServiceLimit),
      });
  
      if (res.ok) {
        const updatedServiceLimits = await fetch("/api/servicelimit");
        const data = await updatedServiceLimits.json();
        setServiceLimits(data.serviceLimits);
        setIsEditing(false);
        toast.success("Service limits updated successfully");
      } else {
        toast.error("Failed to update service limits");
      }
    } catch (error) {
      console.error("Error updating service limit:", error);
      toast.error("Failed to update service limits");
    } 
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editedServiceLimit) return;
    setEditedServiceLimit({
      ...editedServiceLimit,
      [e.target.name]: Number(e.target.value),
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f4] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Service Limits</h1>
          <p className="text-lg text-gray-600">Manage temple service limitations and pricing</p>
        </div>

        {isEditing && editedServiceLimit ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Service Limit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thirumanjanam Limit</label>
                <input
                  type="number"
                  name="thirumanjanam"
                  value={editedServiceLimit.thirumanjanam || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Abhisekam Limit</label>
                <input
                  type="number"
                  name="abhisekam"
                  value={editedServiceLimit.abhisekam || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thirumanjanam Price (₹)</label>
                <input
                  type="number"
                  name="thirumanjanamPrice"
                  value={editedServiceLimit.thirumanjanamPrice || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Abhisekam Price (₹)</label>
                <input
                  type="number"
                  name="abhisekamPrice"
                  value={editedServiceLimit.abhisekamPrice || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            {serviceLimits.map((serviceLimit) => (
              <div key={serviceLimit.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Thirumanjanam Limit</p>
                      <p className="text-2xl font-semibold text-gray-900">{serviceLimit.thirumanjanam}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Abhisekam Limit</p>
                      <p className="text-2xl font-semibold text-gray-900">{serviceLimit.abhisekam}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Thirumanjanam Price</p>
                      <p className="text-2xl font-semibold text-gray-900">₹{serviceLimit.thirumanjanamPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Abhisekam Price</p>
                      <p className="text-2xl font-semibold text-gray-900">₹{serviceLimit.abhisekamPrice}</p>
                    </div>
                  </div>
                </div>
                {isApprover && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => handleEdit(serviceLimit)}
                      className="inline-flex items-center px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-300"
                    >
                      <span>Edit Limits</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceLimitsPage;
