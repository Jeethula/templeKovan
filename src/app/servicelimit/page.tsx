"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

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
      } else {
        console.error("Error updating service limit");
      }
    } catch (error) {
      console.error("Error updating service limit:", error);
    }
  };
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editedServiceLimit) return;
    setEditedServiceLimit({
      ...editedServiceLimit,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen min-w-screen w-full bg-[#fdf0f4] p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Service Limits</h1>

      {isEditing && editedServiceLimit ? (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Edit Service Limit</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Thirumanjanam:</label>
            <input
              type="number"
              name="thirumanjanam"
              value={editedServiceLimit.thirumanjanam || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Abhisekam:</label>
            <input
              type="number"
              name="abhisekam"
              value={editedServiceLimit.abhisekam || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Thirumanjanam Price:</label>
            <input
              type="number"
              name="thirumanjanamPrice"
              value={editedServiceLimit.thirumanjanamPrice || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Abhisekam Price:</label>
            <input
              type="number"
              name="abhisekamPrice"
              value={editedServiceLimit.abhisekamPrice || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Update
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-lg mx-auto ">
          {serviceLimits.map((serviceLimit) => (
            <div key={serviceLimit.id} className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-medium text-gray-700">
                <strong>Thirumanjanam:</strong> {serviceLimit.thirumanjanam}
              </p>
              <p className="text-lg font-medium text-gray-700">
                <strong>Abhisekam:</strong> {serviceLimit.abhisekam}
              </p>
              <p className="text-lg font-medium text-gray-700">
                <strong>Thirumanjanam Price:</strong> ₹{serviceLimit.thirumanjanamPrice}
              </p>
              <p className="text-lg font-medium text-gray-700">
                <strong>Abhisekam Price:</strong> ₹{serviceLimit.abhisekamPrice}
              </p>
              {isApprover && (
                
                <button
                  onClick={() => handleEdit(serviceLimit)}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceLimitsPage;
