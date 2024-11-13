import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Download } from 'lucide-react';

interface FormData {
  description: string;
  amount: string;
}

interface DetailsModalProps {
  nameOfTheServiceId: string;
  date: string| null| Date;
  minAmount: number;
  serviceName: string;
  userId:string;
  onSubmitSuccess: () => void;
}
type Service = {
  id: string;
  nameOfTheService: {
    id: string;
    name: string;
    image?: string;
  };
  description: string;
  price: number;
  image?: string;
  paymentMode: string;
  transactionId: string;
  serviceDate: Date;
  createdAt: Date;
  updatedAt: Date;
  approvedBy:{
    phone: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  }
    posUser:{
      phone: string;
      email: string;
      personalInfo: {
        firstName: string;
        lastName: string;
      }
    }
  status: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFF9F0',
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#8B4513',
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginBottom: 20,
  },
  decorativeLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#8B4513',
    marginBottom: 20,
    opacity: 0.3,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 25,
    border: '1px solid #D4AF37',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1px solid #F0E6D6',
  },
  label: {
    width: '40%',
    fontSize: 11,
    color: '#8B4513',
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    width: '60%',
    fontSize: 11,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  footer: {
    marginTop: 30,
    padding: 20,
    borderTop: '2px solid #D4AF37',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#8B4513',
    textAlign: 'center',
    fontFamily: 'Helvetica',
    marginBottom: 5,
  },
  blessingText: {
    fontSize: 14,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 15,
  },
  receiptTitle: {
    fontSize: 16,
    color: '#8B0000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ornament: {
    fontSize: 24,
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 10,
  },
});

const MyDocumentForPos: React.FC<{ 
  rowData: Service; 
  userData: { 
    id: string; 
    email: string; 
    phone: string 
  }; 
  posUserData:{
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
}> = ({ rowData, userData, posUserData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Sri Renuka Akkamma Temple</Text>
        <Text style={styles.subtitle}></Text>
        <View style={styles.decorativeLine} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.ornament}>☸</Text>
        <Text style={styles.receiptTitle}>Seva Receipt</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Devotee ID</Text>
          <Text style={styles.value}>{userData.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Contact Details</Text>
          <Text style={styles.value}>{userData.phone} | {userData.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seva Name</Text>
          <Text style={styles.value}>{rowData.nameOfTheService.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{rowData.description}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Seva Date</Text>
          <Text style={styles.value}>{new Date(rowData.serviceDate).toLocaleDateString('en-GB')}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Offering Amount</Text>
          <Text style={styles.value}>{rowData.price} INR</Text>
        </View>


        <View style={styles.row}>
          <Text style={styles.label}>POS User By</Text>
          <Text style={styles.value}>{posUserData?.firstName} {posUserData?.lastName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>POS Contact</Text>
          <Text style={styles.value}>{posUserData?.phoneNumber}</Text>
        </View>

        <View style={[styles.row, { borderBottom: 'none' }]}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{rowData.status}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a computer generated receipt. No signature required.
        </Text>
        <Text style={styles.footerText}>
          For any queries, please contact the temple office.
        </Text>
        {/* <Text style={styles.blessingText}>
          
        </Text> */}
      </View>
    </Page>
  </Document>
);

const DetailsModal = ({ nameOfTheServiceId,serviceName, date,minAmount, onSubmitSuccess,userId  }: DetailsModalProps) => {
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const posUserId: string = sessionData.id;

  const [formData, setFormData] = useState<FormData>({
    description: '',
    amount: '', 
  });

  const [errors, setErrors] = useState({
    description: '',
    amount: '', 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [print,setPrint]=useState(false);
  const [transaction, setTransaction] = useState<Service | null>(null)

  const DownloadButton = () => {
    if (!transaction || !transaction.posUser) {
      return null;
    }

    const posUserData = {
      firstName: transaction.posUser.personalInfo.firstName,
      lastName: transaction.posUser.personalInfo.lastName,
      phoneNumber: transaction.posUser.phone
    };

    return (
      <PDFDownloadLink 
        document={<MyDocumentForPos rowData={transaction} userData={sessionData} posUserData={posUserData} />}
        fileName="Service_Details.pdf"
      >
        <Button className="w-full flex items-center justify-center gap-1.5 text-white bg-[rgb(102,51,153)] text-xs font-medium px-3 py-2 transition-colors duration-200 hover:bg-[#6a32a5]">
          <Download className="w-3 h-3" />
          Download Receipt
        </Button>
      </PDFDownloadLink>
    )
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    setFormData(prev => ({
      ...prev,
      [id]: files ? files[0] : value
    }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {
      description: '',
      amount: '',
    };

    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    
    // Move minAmount validation here, before the main validation check
    if (formData.amount && parseInt(formData.amount) < minAmount) {
      newErrors.amount = `Amount should be greater than or equal to ${minAmount}`;
    }

    if (Object.keys(newErrors).some(key => newErrors[key as keyof typeof newErrors])) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/services/posuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          price: parseInt(formData.amount),
          paymentMode: "byPOS",
          serviceDate: date,
          nameOfTheServiceId,
          userId, 
          posUserId
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Form submitted successfully!')
        setFormData({
          description: '',
          amount: '',
        });
        setPrint(true);
        // Fix: Set the correct service data from the response
        setTransaction(data.service);
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.log(error);
      toast.error('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel=()=>{
    onSubmitSuccess()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">{serviceName} Details</h1>
      {print && transaction ? (
        <div className="space-y-4">
          <DownloadButton />
          <Button 
            className="w-full bg-[rgb(102,51,153)] text-white hover:bg-[#6a32a5]" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder=" "
          className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
          <Label
            htmlFor="description"
            className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Description
          </Label>
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="relative">
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder=" "
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <Label
            htmlFor="amount"
            className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Amount
          </Label>
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>
        <Button
          className="w-full bg-[rgb(102,51,153)] text-white hover:bg-[#6a32a5]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) :(
            `Submit ${serviceName}`
          )}
        </Button>
      </form>)}
    </div>
  );
};

export default DetailsModal;