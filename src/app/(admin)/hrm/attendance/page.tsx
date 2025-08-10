"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const AttendancePage = () => {
  const [attendanceRecords] = useState([
    { id: "EMP-001", name: "John Smith", date: "2024-02-26", clockIn: "09:00 AM", clockOut: "06:00 PM", hours: "8.0", status: "Present" },
    { id: "EMP-002", name: "Sarah Johnson", date: "2024-02-26", clockIn: "08:45 AM", clockOut: "05:30 PM", hours: "8.75", status: "Present" },
    { id: "EMP-003", name: "Mike Wilson", date: "2024-02-26", clockIn: "-", clockOut: "-", hours: "0", status: "Absent" },
    { id: "EMP-004", name: "Alice Cooper", date: "2024-02-26", clockIn: "09:15 AM", clockOut: "06:15 PM", hours: "8.0", status: "Late" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Late": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Absent": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "Half Day": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Attendance" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Employee Attendance
          </h3>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button>Mark Attendance</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-sm text-green-700 dark:text-green-300">Attendance Rate</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">118</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Present Today</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">7</div>
            <div className="text-sm text-red-700 dark:text-red-300">Absent Today</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Late Arrivals</div>
          </div>
        </div>

        <div className="mb-4 flex gap-4">
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            defaultValue="2024-02-26"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option>All Departments</option>
            <option>IT</option>
            <option>Marketing</option>
            <option>Sales</option>
            <option>HR</option>
          </select>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Employee
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Clock In
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Clock Out
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Hours
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => (
              <TableRow key={`${record.id}-${record.date}`} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{record.name}</div>
                    <div className="text-xs text-gray-500">{record.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {record.date}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {record.clockIn}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {record.clockOut}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {record.hours}h
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">Edit</Button>
                  <Button variant="link">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendancePage;