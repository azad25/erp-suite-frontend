"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    customerId: string;
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
}

const CreateInvoicePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        invoiceNumber: `INV-${Date.now()}`,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        customerId: "",
        customerName: "",
        customerEmail: "",
        customerAddress: "",
        items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0 }],
        subtotal: 0,
        taxRate: 8.5,
        taxAmount: 0,
        discountRate: 0,
        discountAmount: 0,
        total: 0,
        notes: "",
        terms: "Payment is due within 30 days of invoice date."
    });

    const [customers] = useState([
        { id: "CUS-001", name: "Tech Corp", email: "billing@techcorp.com", address: "123 Tech Street, Silicon Valley, CA 94000" },
        { id: "CUS-002", name: "Design Studio", email: "accounts@design.com", address: "456 Creative Ave, New York, NY 10001" },
        { id: "CUS-003", name: "Marketing Inc", email: "finance@marketing.com", address: "789 Brand Blvd, Los Angeles, CA 90210" },
    ]);

    const calculateTotals = (items: InvoiceItem[], taxRate: number, discountRate: number) => {
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const discountAmount = (subtotal * discountRate) / 100;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = (taxableAmount * taxRate) / 100;
        const total = taxableAmount + taxAmount;

        return { subtotal, discountAmount, taxAmount, total };
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...invoiceData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'quantity' || field === 'rate') {
            newItems[index].amount = newItems[index].quantity * newItems[index].rate;
        }

        const totals = calculateTotals(newItems, invoiceData.taxRate, invoiceData.discountRate);

        setInvoiceData({
            ...invoiceData,
            items: newItems,
            ...totals
        });
    };

    const addItem = () => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            description: "",
            quantity: 1,
            rate: 0,
            amount: 0
        };

        const newItems = [...invoiceData.items, newItem];
        const totals = calculateTotals(newItems, invoiceData.taxRate, invoiceData.discountRate);

        setInvoiceData({
            ...invoiceData,
            items: newItems,
            ...totals
        });
    };

    const removeItem = (index: number) => {
        if (invoiceData.items.length > 1) {
            const newItems = invoiceData.items.filter((_, i) => i !== index);
            const totals = calculateTotals(newItems, invoiceData.taxRate, invoiceData.discountRate);

            setInvoiceData({
                ...invoiceData,
                items: newItems,
                ...totals
            });
        }
    };

    const handleCustomerChange = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
            setInvoiceData({
                ...invoiceData,
                customerId,
                customerName: customer.name,
                customerEmail: customer.email,
                customerAddress: customer.address
            });
        }
    };

    const handleTaxRateChange = (taxRate: number) => {
        const totals = calculateTotals(invoiceData.items, taxRate, invoiceData.discountRate);
        setInvoiceData({
            ...invoiceData,
            taxRate,
            ...totals
        });
    };

    const handleDiscountRateChange = (discountRate: number) => {
        const totals = calculateTotals(invoiceData.items, invoiceData.taxRate, discountRate);
        setInvoiceData({
            ...invoiceData,
            discountRate,
            ...totals
        });
    };

    const handleSave = async (status: 'draft' | 'sent') => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saving invoice:', { ...invoiceData, status });
            router.push('/sales/invoices');
        } catch (error) {
            console.error('Error saving invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        // Open preview modal or new window
        console.log('Preview invoice:', invoiceData);
    };

    return (
        <div className="p-6">
            <PageBreadcrumb pageTitle="Create Invoice" />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        New Invoice
                    </h3>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePreview}>
                            Preview
                        </Button>
                        <Button variant="outline" onClick={() => handleSave('draft')} disabled={loading}>
                            Save as Draft
                        </Button>
                        <Button onClick={() => handleSave('sent')} disabled={loading}>
                            {loading ? 'Saving...' : 'Save & Send'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Invoice Details */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                Invoice Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Invoice Number
                                    </label>
                                    <input
                                        type="text"
                                        value={invoiceData.invoiceNumber}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Issue Date
                                    </label>
                                    <input
                                        type="date"
                                        value={invoiceData.issueDate}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, issueDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={invoiceData.dueDate}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                Customer Information
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Select Customer
                                    </label>
                                    <select
                                        value={invoiceData.customerId}
                                        onChange={(e) => handleCustomerChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">Select a customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Customer Name
                                    </label>
                                    <input
                                        type="text"
                                        value={invoiceData.customerName}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={invoiceData.customerEmail}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Billing Address
                                    </label>
                                    <textarea
                                        value={invoiceData.customerAddress}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, customerAddress: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Items & Totals */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                                    Invoice Items
                                </h4>
                                <Button size="sm" onClick={addItem}>
                                    Add Item
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {invoiceData.items.map((item, index) => (
                                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="grid grid-cols-12 gap-2 items-end">
                                            <div className="col-span-5">
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    placeholder="Item description"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Qty
                                                </label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Rate
                                                </label>
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Amount
                                                </label>
                                                <div className="px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                                                    ${item.amount.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                    disabled={invoiceData.items.length === 1}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span className="text-sm font-medium">${invoiceData.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                                        <input
                                            type="number"
                                            value={invoiceData.discountRate}
                                            onChange={(e) => handleDiscountRateChange(parseFloat(e.target.value) || 0)}
                                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                        />
                                        <span className="text-xs text-gray-500">%</span>
                                    </div>
                                    <span className="text-sm font-medium">-${invoiceData.discountAmount.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Tax:</span>
                                        <input
                                            type="number"
                                            value={invoiceData.taxRate}
                                            onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
                                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                        />
                                        <span className="text-xs text-gray-500">%</span>
                                    </div>
                                    <span className="text-sm font-medium">${invoiceData.taxAmount.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                                    <span className="text-lg font-bold text-brand-600">${invoiceData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes & Terms */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={invoiceData.notes}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Additional notes for the customer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Terms & Conditions
                                </label>
                                <textarea
                                    value={invoiceData.terms}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, terms: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInvoicePage;