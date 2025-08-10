"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { 
  PlusIcon, 
  CheckCircleIcon as CheckIcon, 
  TimeIcon as ClockIcon,
  CalenderIcon as CalendarIcon,
  BellIcon,
  AlertIcon as FlagIcon,
  ListIcon,
  ShootingStarIcon as StarIcon,
  PencilIcon as EditIcon,
  TrashBinIcon as TrashIcon
} from "@/icons";

const TodosPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review quarterly budget report",
      description: "Analyze Q4 spending and prepare recommendations",
      completed: false,
      priority: "high",
      dueDate: "2024-01-20",
      category: "Work",
      reminder: "2024-01-19 09:00",
      starred: true
    },
    {
      id: 2,
      title: "Schedule dentist appointment",
      description: "Annual checkup and cleaning",
      completed: false,
      priority: "medium",
      dueDate: "2024-01-25",
      category: "Personal",
      reminder: null,
      starred: false
    },
    {
      id: 3,
      title: "Update project documentation",
      description: "Add new API endpoints and examples",
      completed: true,
      priority: "medium",
      dueDate: "2024-01-15",
      category: "Work",
      reminder: null,
      starred: false
    },
    {
      id: 4,
      title: "Buy groceries for the week",
      description: "Milk, bread, eggs, vegetables, fruits",
      completed: false,
      priority: "low",
      dueDate: "2024-01-18",
      category: "Personal",
      reminder: "2024-01-18 10:00",
      starred: false
    },
    {
      id: 5,
      title: "Prepare presentation for client meeting",
      description: "Include project timeline and deliverables",
      completed: false,
      priority: "high",
      dueDate: "2024-01-22",
      category: "Work",
      reminder: "2024-01-21 14:00",
      starred: true
    }
  ]);

  const [reminders] = useState([
    {
      id: 1,
      title: "Team standup meeting",
      time: "09:00",
      date: "2024-01-16",
      type: "meeting",
      recurring: "daily"
    },
    {
      id: 2,
      title: "Submit timesheet",
      time: "17:00",
      date: "2024-01-19",
      type: "deadline",
      recurring: "weekly"
    },
    {
      id: 3,
      title: "Call mom",
      time: "19:00",
      date: "2024-01-17",
      type: "personal",
      recurring: null
    },
    {
      id: 4,
      title: "Gym workout",
      time: "18:30",
      date: "2024-01-16",
      type: "health",
      recurring: "daily"
    }
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const toggleStar = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, starred: !todo.starred }
        : todo
    ));
  };

  const getPriorityBadge = (priority: string) => {
    const colorMap = {
      high: 'error',
      medium: 'warning',
      low: 'success'
    } as const;
    return <Badge color={colorMap[priority as keyof typeof colorMap] || 'light'}>{priority}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const colorMap = {
      Work: 'primary',
      Personal: 'info'
    } as const;
    return <Badge color={colorMap[category as keyof typeof colorMap] || 'light'}>{category}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const starredTodos = todos.filter(todo => todo.starred);
  const highPriorityTodos = todos.filter(todo => todo.priority === 'high' && !todo.completed);

  const renderTodoTable = (todoList: typeof todos) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todoList.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.title}
                      </h3>
                      {todo.starred && <StarIcon className="h-4 w-4 text-yellow-500" />}
                    </div>
                    {todo.description && (
                      <p className={`text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                        {todo.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getPriorityBadge(todo.priority)}</TableCell>
              <TableCell>{getCategoryBadge(todo.category)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{formatDate(todo.dueDate)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleStar(todo.id)}
                  >
                    <StarIcon className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <EditIcon className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderReminderTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reminders.map((reminder) => (
            <TableRow key={reminder.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <BellIcon className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{reminder.title}</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(reminder.date)}</TableCell>
              <TableCell>{formatTime(reminder.time)}</TableCell>
              <TableCell>
                <Badge>{reminder.type}</Badge>
                {reminder.recurring && (
                  <Badge color="light" size="sm">{reminder.recurring}</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <EditIcon className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="To-do & Reminders" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">To-do & Reminders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your tasks, set reminders, and stay organized
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" startIcon={<BellIcon />}>
            Add Reminder
          </Button>
          <Button startIcon={<PlusIcon />}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ListIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeTodos.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTodos.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FlagIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{highPriorityTodos.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <StarIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{starredTodos.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Starred</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'active', label: `Active (${activeTodos.length})` },
            { key: 'completed', label: `Completed (${completedTodos.length})` },
            { key: 'starred', label: `Starred (${starredTodos.length})` },
            { key: 'reminders', label: `Reminders (${reminders.length})` }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'active' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Tasks</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="all">All Categories</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
                <Button variant="outline">Filter</Button>
              </div>
            </div>
            {renderTodoTable(activeTodos)}
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Completed Tasks</h2>
            {renderTodoTable(completedTodos)}
          </div>
        )}

        {activeTab === 'starred' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Starred Tasks</h2>
            {renderTodoTable(starredTodos)}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Reminders</h2>
              <Button startIcon={<PlusIcon />}>Add Reminder</Button>
            </div>
            {renderReminderTable()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodosPage;