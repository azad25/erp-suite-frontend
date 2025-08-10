"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import Badge from "@/components/ui/badge/Badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog/Dialog";
import {
  BoxCubeIcon as WarehouseIcon,
  PlusIcon,
  UserIcon as SearchIcon,
  FileIcon as FilterIcon,
  PageIcon as MapPinIcon,
  BoxIcon as PackageIcon,
  ArrowRightIcon as TruckIcon,
  GroupIcon as UsersIcon,
  PencilIcon as EditIcon,
  TrashBinIcon as TrashIcon,
  EyeIcon,
  BoxIcon as SettingsIcon,
  PieChartIcon as BarChart3Icon,
  AlertIcon as AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon as XIcon,
  CheckCircleIcon as SaveIcon
} from "@/icons";

interface Warehouse {
  id: number;
  name: string;
  code: string;
  type: string;
  status: string;
  address: string;
  manager: string;
  capacity: number;
  currentStock: number;
  utilizationRate: number;
  totalProducts: number;
  activeOrders: number;
  lastInventoryCheck: string;
  phone: string;
  email: string;
}

interface WarehouseForm {
  name: string;
  code: string;
  type: string;
  status: string;
  address: string;
  manager: string;
  capacity: number;
  phone: string;
  email: string;
}

const WarehousesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<WarehouseForm>({
    name: '',
    code: '',
    type: 'Distribution',
    status: 'active',
    address: '',
    manager: '',
    capacity: 0,
    phone: '',
    email: ''
  });

  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      name: "Main Distribution Center",
      code: "WH001",
      type: "Distribution",
      status: "active",
      address: "123 Industrial Blvd, City, State 12345",
      manager: "John Smith",
      capacity: 50000,
      currentStock: 35000,
      utilizationRate: 70,
      totalProducts: 1250,
      activeOrders: 45,
      lastInventoryCheck: "2024-01-10",
      phone: "+1 (555) 123-4567",
      email: "warehouse1@company.com"
    },
    {
      id: 2,
      name: "East Coast Warehouse",
      code: "WH002",
      type: "Regional",
      status: "active",
      address: "456 Commerce St, East City, State 67890",
      manager: "Sarah Johnson",
      capacity: 30000,
      currentStock: 22500,
      utilizationRate: 75,
      totalProducts: 850,
      activeOrders: 28,
      lastInventoryCheck: "2024-01-12",
      phone: "+1 (555) 234-5678",
      email: "warehouse2@company.com"
    },
    {
      id: 3,
      name: "West Coast Hub",
      code: "WH003",
      type: "Hub",
      status: "active",
      address: "789 Logistics Ave, West City, State 54321",
      manager: "Mike Davis",
      capacity: 40000,
      currentStock: 18000,
      utilizationRate: 45,
      totalProducts: 650,
      activeOrders: 32,
      lastInventoryCheck: "2024-01-08",
      phone: "+1 (555) 345-6789",
      email: "warehouse3@company.com"
    },
    {
      id: 4,
      name: "Cold Storage Facility",
      code: "WH004",
      type: "Cold Storage",
      status: "maintenance",
      address: "321 Frozen Way, Cold City, State 98765",
      manager: "Emily Wilson",
      capacity: 15000,
      currentStock: 8500,
      utilizationRate: 57,
      totalProducts: 320,
      activeOrders: 12,
      lastInventoryCheck: "2024-01-05",
      phone: "+1 (555) 456-7890",
      email: "warehouse4@company.com"
    },
    {
      id: 5,
      name: "Returns Processing Center",
      code: "WH005",
      type: "Returns",
      status: "active",
      address: "654 Return Rd, Process City, State 13579",
      manager: "Robert Chen",
      capacity: 20000,
      currentStock: 5000,
      utilizationRate: 25,
      totalProducts: 180,
      activeOrders: 8,
      lastInventoryCheck: "2024-01-14",
      phone: "+1 (555) 567-8901",
      email: "warehouse5@company.com"
    }
  ]);

  const toggleWarehouseStatus = (id: number) => {
    setWarehouses(warehouses.map(warehouse =>
      warehouse.id === id
        ? {
          ...warehouse,
          status: warehouse.status === 'active' ? 'inactive' : 'active'
        }
        : warehouse
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <AlertTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangleIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colorMap = {
      active: 'success',
      maintenance: 'warning',
      inactive: 'error'
    } as const;

    return (
      <Badge color={colorMap[status as keyof typeof colorMap] || 'light'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeColor = (type: string) => {
    const colorMap = {
      'Distribution': 'primary',
      'Regional': 'info',
      'Hub': 'success',
      'Cold Storage': 'info',
      'Returns': 'warning'
    } as const;
    return colorMap[type as keyof typeof colorMap] || 'light';
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'text-red-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CRUD Operations
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      type: 'Distribution',
      status: 'active',
      address: '',
      manager: '',
      capacity: 0,
      phone: '',
      email: ''
    });
  };

  const handleCreate = () => {
    const newWarehouse: Warehouse = {
      id: Math.max(...warehouses.map(w => w.id)) + 1,
      ...formData,
      currentStock: 0,
      utilizationRate: 0,
      totalProducts: 0,
      activeOrders: 0,
      lastInventoryCheck: new Date().toISOString().split('T')[0]
    };
    setWarehouses([...warehouses, newWarehouse]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      code: warehouse.code,
      type: warehouse.type,
      status: warehouse.status,
      address: warehouse.address,
      manager: warehouse.manager,
      capacity: warehouse.capacity,
      phone: warehouse.phone,
      email: warehouse.email
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedWarehouse) return;

    setWarehouses(warehouses.map(warehouse =>
      warehouse.id === selectedWarehouse.id
        ? { ...warehouse, ...formData }
        : warehouse
    ));
    setIsEditDialogOpen(false);
    setSelectedWarehouse(null);
    resetForm();
  };

  const handleDelete = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedWarehouse) return;

    setWarehouses(warehouses.filter(warehouse => warehouse.id !== selectedWarehouse.id));
    setIsDeleteDialogOpen(false);
    setSelectedWarehouse(null);
  };

  const handleFormChange = (field: keyof WarehouseForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalCapacity = warehouses.reduce((sum, wh) => sum + wh.capacity, 0);
  const averageUtilization = warehouses.reduce((sum, wh) => sum + wh.utilizationRate, 0) / warehouses.length;
  const activeWarehouses = warehouses.filter(wh => wh.status === 'active').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-gray-600 mt-2">
            Manage warehouse locations, capacity, and operations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Warehouse</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Warehouse Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter warehouse name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Warehouse Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleFormChange('code', e.target.value)}
                  placeholder="WH001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleFormChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Distribution">Distribution</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                    <SelectItem value="Hub">Hub</SelectItem>
                    <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                    <SelectItem value="Returns">Returns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  placeholder="Enter full address"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => handleFormChange('manager', e.target.value)}
                  placeholder="Manager name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (sq ft)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleFormChange('capacity', parseInt(e.target.value) || 0)}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="warehouse@company.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                <SaveIcon className="h-4 w-4 mr-2" />
                Create Warehouse
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <WarehouseIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{warehouses.length}</p>
                <p className="text-sm text-gray-600">Total Warehouses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeWarehouses}</p>
                <p className="text-sm text-gray-600">Active Warehouses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PackageIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCapacity.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Capacity (sq ft)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3Icon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageUtilization.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Avg Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search warehouses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="distribution">Distribution</SelectItem>
              <SelectItem value="regional">Regional</SelectItem>
              <SelectItem value="hub">Hub</SelectItem>
              <SelectItem value="cold">Cold Storage</SelectItem>
              <SelectItem value="returns">Returns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWarehouses.map((warehouse) => (
              <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(warehouse.status)}
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        <p className="text-sm text-gray-600">{warehouse.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(warehouse.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge color={getTypeColor(warehouse.type)}>
                        {warehouse.type}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{warehouse.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Manager: {warehouse.manager}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilization</span>
                        <span className={getUtilizationColor(warehouse.utilizationRate)}>
                          {warehouse.utilizationRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${warehouse.utilizationRate >= 80 ? 'bg-red-500' :
                            warehouse.utilizationRate >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${warehouse.utilizationRate}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{warehouse.currentStock.toLocaleString()} sq ft used</span>
                        <span>{warehouse.capacity.toLocaleString()} sq ft total</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Products</p>
                        <p className="font-medium">{warehouse.totalProducts}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Active Orders</p>
                        <p className="font-medium">{warehouse.activeOrders}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <EyeIcon className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(warehouse)}>
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(warehouse)}>
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="space-y-4">
            {filteredWarehouses.map((warehouse) => (
              <Card key={warehouse.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(warehouse.status)}
                      <div>
                        <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                        <p className="text-sm text-gray-600">{warehouse.code} • {warehouse.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(warehouse.status)}
                      <Switch
                        checked={warehouse.status === 'active'}
                        onCheckedChange={() => toggleWarehouseStatus(warehouse.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Location Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-600">{warehouse.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Manager: {warehouse.manager}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">📞 {warehouse.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">✉️ {warehouse.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Capacity & Utilization</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Capacity:</span>
                          <span className="font-medium">{warehouse.capacity.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Stock:</span>
                          <span className="font-medium">{warehouse.currentStock.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilization Rate:</span>
                          <span className={`font-medium ${getUtilizationColor(warehouse.utilizationRate)}`}>
                            {warehouse.utilizationRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${warehouse.utilizationRate >= 80 ? 'bg-red-500' :
                              warehouse.utilizationRate >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${warehouse.utilizationRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Operations</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Products:</span>
                          <span className="font-medium">{warehouse.totalProducts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Orders:</span>
                          <span className="font-medium">{warehouse.activeOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Inventory:</span>
                          <span className="font-medium">{warehouse.lastInventoryCheck}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(warehouse)}>
                      <EditIcon className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Manage Shipments
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3Icon className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(warehouse)}>
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilization by Warehouse Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Distribution', 'Regional', 'Hub', 'Cold Storage', 'Returns'].map((type) => {
                    const typeWarehouses = warehouses.filter(wh => wh.type === type);
                    const avgUtilization = typeWarehouses.length > 0
                      ? typeWarehouses.reduce((sum, wh) => sum + wh.utilizationRate, 0) / typeWarehouses.length
                      : 0;

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{type}</span>
                          <span className={getUtilizationColor(avgUtilization)}>
                            {avgUtilization.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${avgUtilization >= 80 ? 'bg-red-500' :
                              avgUtilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${avgUtilization}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Warehouse Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['active', 'maintenance', 'inactive'].map((status) => {
                    const statusCount = warehouses.filter(wh => wh.status === status).length;
                    const percentage = (statusCount / warehouses.length) * 100;

                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <span className="capitalize">{status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{statusCount}</span>
                          <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Warehouse Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Enter warehouse name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code">Warehouse Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => handleFormChange('code', e.target.value)}
                placeholder="WH001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleFormChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Distribution">Distribution</SelectItem>
                  <SelectItem value="Regional">Regional</SelectItem>
                  <SelectItem value="Hub">Hub</SelectItem>
                  <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                  <SelectItem value="Returns">Returns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                placeholder="Enter full address"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-manager">Manager</Label>
              <Input
                id="edit-manager"
                value={formData.manager}
                onChange={(e) => handleFormChange('manager', e.target.value)}
                placeholder="Manager name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Capacity (sq ft)</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleFormChange('capacity', parseInt(e.target.value) || 0)}
                placeholder="50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="warehouse@company.com"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setSelectedWarehouse(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              <SaveIcon className="h-4 w-4 mr-2" />
              Update Warehouse
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Warehouse</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete <strong>{selectedWarehouse?.name}</strong>?
              This action cannot be undone.
            </p>
            {selectedWarehouse && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm space-y-1">
                  <p><strong>Code:</strong> {selectedWarehouse.code}</p>
                  <p><strong>Type:</strong> {selectedWarehouse.type}</p>
                  <p><strong>Manager:</strong> {selectedWarehouse.manager}</p>
                  <p><strong>Products:</strong> {selectedWarehouse.totalProducts}</p>
                  <p><strong>Active Orders:</strong> {selectedWarehouse.activeOrders}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedWarehouse(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Warehouse
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehousesPage;