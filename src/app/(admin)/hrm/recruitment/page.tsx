"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const RecruitmentPage = () => {
  const [jobPostings] = useState([
    { id: "JOB-001", title: "Senior Software Engineer", department: "IT", location: "Remote", type: "Full-time", applicants: 25, status: "Active", postedDate: "2024-02-15" },
    { id: "JOB-002", title: "Marketing Manager", department: "Marketing", location: "New York", type: "Full-time", applicants: 18, status: "Active", postedDate: "2024-02-18" },
    { id: "JOB-003", title: "Sales Representative", department: "Sales", location: "California", type: "Full-time", applicants: 12, status: "Closed", postedDate: "2024-01-20" },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Closed": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      case "Draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "Part-time": return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      case "Contract": return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Recruitment" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Job Postings & Recruitment
          </h3>
          <Button>Create Job Posting</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Active Postings</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">55</div>
            <div className="text-sm text-green-700 dark:text-green-300">Total Applicants</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">In Review</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Hired This Month</div>
          </div>
        </div>

        <Table className="border border-gray-200 dark:border-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Job Title
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Location
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Applicants
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Posted Date
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPostings.map((job) => (
              <TableRow key={job.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <div>
                    <div>{job.title}</div>
                    <div className="text-xs text-gray-500">{job.id}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {job.department}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {job.location}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(job.type)}`}>
                    {job.type}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {job.applicants}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {job.postedDate}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="link" className="mr-4">View Applicants</Button>
                  <Button variant="link">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecruitmentPage;