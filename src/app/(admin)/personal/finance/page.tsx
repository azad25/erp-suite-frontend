"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarLineIcon as DollarSignIcon, 
  ArrowUpIcon as TrendingUpIcon, 
  ArrowDownIcon as TrendingDownIcon,
  PlusIcon,
  BoxIcon as CreditCardIcon,
  BoxCubeIcon as PiggyBankIcon,
  PageIcon as TargetIcon,
  CalenderIcon as CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@/icons";

const PersonalFinancePage = () => {
  const [accounts] = useState([
    {
      id: 1,
      name: "Checking Account",
      type: "checking",
      balance: 5420.50,
      change: 150.25,
      changePercent: 2.8
    },
    {
      id: 2,
      name: "Savings Account",
      type: "savings",
      balance: 12750.00,
      change: -200.00,
      changePercent: -1.5
    },
    {
      id: 3,
      name: "Investment Portfolio",
      type: "investment",
      balance: 25680.75,
      change: 1250.30,
      changePercent: 5.1
    },
    {
      id: 4,
      name: "Credit Card",
      type: "credit",
      balance: -1850.25,
      change: -150.00,
      changePercent: 8.8
    }
  ]);

  const [transactions] = useState([
    {
      id: 1,
      description: "Salary Deposit",
      amount: 4500.00,
      type: "income",
      category: "Salary",
      date: "2024-01-15",
      account: "Checking Account"
    },
    {
      id: 2,
      description: "Grocery Shopping",
      amount: -125.50,
      type: "expense",
      category: "Food",
      date: "2024-01-14",
      account: "Credit Card"
    },
    {
      id: 3,
      description: "Investment Dividend",
      amount: 85.25,
      type: "income",
      category: "Investment",
      date: "2024-01-13",
      account: "Investment Portfolio"
    },
    {
      id: 4,
      description: "Rent Payment",
      amount: -1200.00,
      type: "expense",
      category: "Housing",
      date: "2024-01-12",
      account: "Checking Account"
    },
    {
      id: 5,
      description: "Freelance Project",
      amount: 750.00,
      type: "income",
      category: "Freelance",
      date: "2024-01-11",
      account: "Checking Account"
    }
  ]);

  const [budgets] = useState([
    {
      id: 1,
      category: "Food & Dining",
      budgeted: 600,
      spent: 425.50,
      remaining: 174.50,
      percentage: 71
    },
    {
      id: 2,
      category: "Transportation",
      budgeted: 300,
      spent: 180.25,
      remaining: 119.75,
      percentage: 60
    },
    {
      id: 3,
      category: "Entertainment",
      budgeted: 200,
      spent: 245.00,
      remaining: -45.00,
      percentage: 123
    },
    {
      id: 4,
      category: "Shopping",
      budgeted: 400,
      spent: 125.75,
      remaining: 274.25,
      percentage: 31
    }
  ]);

  const [goals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      target: 10000,
      current: 7500,
      percentage: 75,
      deadline: "2024-12-31"
    },
    {
      id: 2,
      name: "Vacation Fund",
      target: 3000,
      current: 1250,
      percentage: 42,
      deadline: "2024-06-30"
    },
    {
      id: 3,
      name: "New Car",
      target: 25000,
      current: 8500,
      percentage: 34,
      deadline: "2025-03-31"
    }
  ]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCardIcon className="h-5 w-5 text-blue-500" />;
      case 'savings':
        return <PiggyBankIcon className="h-5 w-5 text-green-500" />;
      case 'investment':
        return <TrendingUpIcon className="h-5 w-5 text-purple-500" />;
      case 'credit':
        return <CreditCardIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DollarSignIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getBudgetColor = (percentage: number) => {
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Personal Finance</h1>
          <p className="text-gray-600 mt-2">
            Track your personal finances, budgets, and financial goals
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSignIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                <p className="text-sm text-gray-600">Net Worth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                <p className="text-sm text-gray-600">This Month Income</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowDownIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                <p className="text-sm text-gray-600">This Month Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TargetIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{goals.length}</p>
                <p className="text-sm text-gray-600">Active Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getAccountIcon(account.type)}
                      <div>
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                        <p className="text-sm text-gray-600 capitalize">{account.type}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        {formatCurrency(account.balance)}
                      </span>
                      <div className={`flex items-center gap-1 text-sm ${
                        account.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {account.change >= 0 ? (
                          <TrendingUpIcon className="h-4 w-4" />
                        ) : (
                          <TrendingDownIcon className="h-4 w-4" />
                        )}
                        <span>{formatCurrency(Math.abs(account.change))}</span>
                        <span>({Math.abs(account.changePercent)}%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Filter</Button>
            </div>
          </div>

          <div className="space-y-2">
            {transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{transaction.description}</h3>
                        <p className="text-sm text-gray-600">
                          {transaction.category} • {transaction.account}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Monthly Budgets</h2>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((budget) => (
              <Card key={budget.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Spent: {formatCurrency(budget.spent)}</span>
                      <span>Budget: {formatCurrency(budget.budgeted)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getBudgetColor(budget.percentage)}`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {budget.remaining >= 0 ? 'Remaining: ' : 'Over budget: '}
                        {formatCurrency(Math.abs(budget.remaining))}
                      </span>
                      <span className="text-gray-600">{budget.percentage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Financial Goals</h2>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Due: {goal.deadline}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {formatCurrency(goal.current)}</span>
                      <span>Target: {formatCurrency(goal.target)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${goal.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{goal.percentage}% complete</span>
                      <span className="text-gray-600">
                        {formatCurrency(goal.target - goal.current)} to go
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalFinancePage;