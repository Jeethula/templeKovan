import { useState, useEffect } from 'react';

type ApprovedByData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const UseApprovedByData = (approvedById: string | null) => {
  const [approvedByData, setApprovedByData] = useState<ApprovedByData | null>(null);

  useEffect(() => {
    const fetchApprovedByData = async () => {
      try {
        if (approvedById) {
          const response = await fetch(`/api/approverdetails?approvedById=${approvedById}`);
          const data = await response.json();
          setApprovedByData(data.user.personalInfo);
        } else {
          setApprovedByData({ firstName: "Not Approved Yet", lastName: "", phoneNumber: "" });
        }
      } catch (error) {
        console.error("Error fetching approvedBy data:", error);
      }
    };

    fetchApprovedByData();
  }, [approvedById]);

  return approvedByData;
};

export default UseApprovedByData;