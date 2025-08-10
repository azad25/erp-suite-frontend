"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

const AIInsightsPage = () => {
  const [insights] = useState([
    {
      type: "Sales Prediction",
      title: "Q2 Sales Forecast",
      description: "Based on current trends, Q2 sales are projected to increase by 15%",
      confidence: 87,
      impact: "High",
      category: "Sales",
      date: "2024-02-26",
      status: "New"
    },
    {
      type: "Inventory Alert",
      title: "Restock Recommendation",
      description: "Laptop Pro inventory will run out in 12 days. Recommend ordering 50 units",
      confidence: 94,
      impact: "Medium",
      category: "Inventory",
      date: "2024-02-25",
      status: "Acknowledged"
    },
    {
      type: "Customer Behavior",
      title: "Churn Risk Analysis",
      description: "3 high-value customers show signs of potential churn in the next 30 days",
      confidence: 78,
      impact: "High",
      category: "CRM",
      date: "2024-02-24",
      status: "Action Required"
    },
    {
      type: "Financial Trend",
      title: "Cash Flow Optimization",
      description: "Adjusting payment terms could improve cash flow by $25K monthly",
      confidence: 82,
      impact: "Medium",
      category: "Finance",
      date: "2024-02-23",
      status: "Under Review"
    }
  ]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "Acknowledged": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Action Required": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "Under Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Sales": return "📈";
      case "Inventory": return "📦";
      case "CRM": return "👥";
      case "Finance": return "💰";
      default: return "🔍";
    }
  };

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="AI Insights" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI-Powered Business Insights
          </h3>
          <Button>Refresh Insights</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Insights</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">8</div>
            <div className="text-sm text-red-700 dark:text-red-300">High Impact</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Action Required</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-green-700 dark:text-green-300">Avg Confidence</div>
          </div>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getCategoryIcon(insight.category)}</span>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {insight.type} • {insight.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(insight.impact)}`}>
                    {insight.impact} Impact
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(insight.status)}`}>
                    {insight.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {insight.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Confidence:</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-brand-600 h-2 rounded-full" 
                        style={{ width: `${insight.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {insight.confidence}%
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">
                    Take Action
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
            AI Analysis Categories
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl mb-1">📈</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Sales Forecasting</div>
              <div className="text-xs text-gray-500">Predict future sales trends</div>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">📦</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Inventory Optimization</div>
              <div className="text-xs text-gray-500">Smart restock suggestions</div>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">👥</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Customer Analytics</div>
              <div className="text-xs text-gray-500">Behavior and churn analysis</div>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">💰</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Financial Intelligence</div>
              <div className="text-xs text-gray-500">Cash flow optimization</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;