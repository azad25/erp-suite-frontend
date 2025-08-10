"use client";
import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  notes: string;
  terms: string;
  organizationName: string;
  organizationAddress: string;
  organizationEmail: string;
  organizationPhone: string;
}

const InvoiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  
  // Mock invoice data - in real app, fetch based on params.id
  const [invoice] = useState<InvoiceData>({
    id: params.id as string,
    invoiceNumber: "INV-001",
    issueDate: "2024-02-15",
    dueDate: "2024-03-15",
    status: "Sent",
    customerName: "Tech Corp",
    customerEmail: "billing@techcorp.com",
    customerAddress: "123 Tech Street\nSilicon Valley, CA 94000",
    items: [
      { id: "1", description: "Website Development", quantity: 1, rate: 15000, amount: 15000 },
      { id: "2", description: "SEO Optimization", quantity: 3, rate: 2000, amount: 6000 },
      { id: "3", description: "Maintenance (Monthly)", quantity: 12, rate: 500, amount: 6000 }
    ],
    subtotal: 27000,
    taxRate: 8.5,
    taxAmount: 2295,
    discountRate: 5,
    discountAmount: 1350,
    total: 27945,
    notes: "Thank you for your business!",
    terms: "Payment is due within 30 days of invoice date. Late payments may incur additional charges.",
    organizationName: "Unibase ERP Solutions",
    organizationAddress: "456 Business Ave\nNew York, NY 10001",
    organizationEmail: "billing@unibase.com",
    organizationPhone: "+1 (555) 123-4567"
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      // In a real app, this would call an API to generate PDF
      const response = await fetch('/api/invoices/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoice.invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback: open print dialog
      handlePrint();
    }
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch('/api/invoices/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id, email: invoice.customerEmail })
      });
      
      if (response.ok) {
        alert('Invoice sent successfully!');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Sent": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "Draft": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      case "Overdue": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle={`Invoice ${invoice.invoiceNumber}`} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Action Bar */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Invoice {invoice.invoiceNumber}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/sales/invoices/${invoice.id}/edit`)}>
              Edit
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              Print
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            <Button onClick={handleSendEmail}>
              Send Email
            </Button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="p-8 print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h1>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Invoice #: {invoice.invoiceNumber}</p>
                <p>Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
                <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {invoice.organizationName}
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="whitespace-pre-line">{invoice.organizationAddress}</p>
                <p>{invoice.organizationEmail}</p>
                <p>{invoice.organizationPhone}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white">{invoice.customerName}</p>
              <p className="whitespace-pre-line">{invoice.customerAddress}</p>
              <p>{invoice.customerEmail}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                    Qty
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Rate
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {item.description}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-sm text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right text-sm text-gray-900 dark:text-white">
                      ${item.rate.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right text-sm text-gray-900 dark:text-white">
                      ${item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">${invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.discountRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount ({invoice.discountRate}%):</span>
                    <span className="text-gray-900 dark:text-white">-${invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax ({invoice.taxRate}%):</span>
                  <span className="text-gray-900 dark:text-white">${invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 dark:border-gray-600 pt-2">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-brand-600">${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="space-y-4">
              {invoice.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Notes:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Terms & Conditions:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:p-0,
          .print\\:p-0 * {
            visibility: visible;
          }
          .print\\:p-0 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceDetailPage;