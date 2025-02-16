import React, { useState } from "react";
import {
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineTable,
  AiOutlineAppstore,
} from "react-icons/ai";
import Title from "../Component/Title";

const Reports = () => {
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 15;

  const reports = [
    {
      id: 1,
      title: "Monthly Sales Report",
      category: "Sales",
      date: "2024-12-15",
    },
    {
      id: 2,
      title: "Customer Feedback Analysis",
      category: "Feedback",
      date: "2024-12-12",
    },
    {
      id: 3,
      title: "Employee Performance Review",
      category: "HR",
      date: "2024-11-30",
    },
    {
      id: 4,
      title: "Annual Revenue Report",
      category: "Finance",
      date: "2024-12-10",
    },
    {
      id: 5,
      title: "New Product Launch Stats",
      category: "Marketing",
      date: "2024-12-05",
    },
    {
      id: 6,
      title: "Quarterly Expense Report",
      category: "Finance",
      date: "2024-11-20",
    },
    {
      id: 7,
      title: "Team Productivity Metrics",
      category: "HR",
      date: "2024-10-30",
    },
  ];

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(filterTerm.toLowerCase()) &&
      (selectedCategory ? report.category === selectedCategory : true) &&
      (startDate ? new Date(report.date) >= new Date(startDate) : true) &&
      (endDate ? new Date(report.date) <= new Date(endDate) : true)
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <div className="text-3xl mb-4">
        <Title text1="ADMIN" text2="REPORTS" />
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-900 shadow-lg p-4 rounded-md mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-grow">
            <AiOutlineSearch className="text-gray-600 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search by Title"
              className="p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-300"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <AiOutlineFilter className="text-gray-600 dark:text-gray-300" />
            <select
              className="p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Sales">Sales</option>
              <option value="Feedback">Feedback</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-gray-600 dark:text-gray-300">to</span>
            <input
              type="date"
              className="p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md ${
                viewMode === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <AiOutlineTable />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <AiOutlineAppstore />
            </button>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((report) => (
                <tr key={report.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {report.title}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {report.category}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {report.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedReports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4"
            >
              <h3 className="font-bold text-gray-800 dark:text-white">
                {report.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {report.category}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{report.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reports;
