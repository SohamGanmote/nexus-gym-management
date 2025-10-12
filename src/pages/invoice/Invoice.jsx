import { useEffect, useState } from 'react';
import Button from '../../components/ui/button/Button';
import { Printer } from 'lucide-react';
import './Invoice.css'; // Import your CSS file here
import { getInvoice } from '../../http/get/getAPIs';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Table from './Table';
import NoteAndFooter from './NoteAndFooter';

export default function Invoice() {
  const navigate = useNavigate();
  const { subscription_id, invoice_id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    getInvoice(subscription_id || invoice_id).then((date) => {
      setInvoiceData(date);
    });
  }, [subscription_id, invoice_id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="max-w-[1200px] mx-auto sm:mt-10">
      <div className="sm:invoice-container p-5">
        <Header invoiceData={invoiceData} />
        <Table invoiceData={invoiceData} />
        <NoteAndFooter />
      </div>

      {/* Print Button */}
      <div className="fixed sm:bottom-4 bottom-14 right-4 z-10 flex gap-4">
        <Button
          onClick={handlePrint}
          className="flex justify-start items-center mx-auto gap-2 px-5"
        >
          Print Invoice
          <Printer />
        </Button>
        <Button
          onClick={() => navigate('/')}
          className="flex justify-start items-center mx-auto gap-2 px-5"
        >
          back
        </Button>
      </div>
    </section>
  );
}
