// Search service for ERP application pages and features
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon?: string;
  keywords?: string[];
}

export interface SearchCategory {
  name: string;
  icon: string;
  color: string;
}

// Define all available pages and features in the ERP system
const searchData: SearchResult[] = [
  // Dashboard
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Main dashboard with overview and metrics',
    url: '/',
    category: 'Dashboard',
    icon: '📊',
    keywords: ['home', 'overview', 'metrics', 'stats']
  },
  {
    id: 'dashboard-widgets',
    title: 'Dashboard Widgets',
    description: 'Customize dashboard widgets and layout',
    url: '/dashboard/widgets',
    category: 'Dashboard',
    icon: '🧩',
    keywords: ['widgets', 'customize', 'layout']
  },
  {
    id: 'dashboard-quick-actions',
    title: 'Quick Actions',
    description: 'Quick access to common actions',
    url: '/dashboard/quick-actions',
    category: 'Dashboard',
    icon: '⚡',
    keywords: ['quick', 'actions', 'shortcuts']
  },

  // User Management
  {
    id: 'users',
    title: 'User Management',
    description: 'Manage users, roles, and permissions',
    url: '/users',
    category: 'Users',
    icon: '👥',
    keywords: ['users', 'people', 'staff', 'employees', 'team']
  },
  {
    id: 'users-create',
    title: 'Create User',
    description: 'Add new users to the system',
    url: '/users/create',
    category: 'Users',
    icon: '👤',
    keywords: ['add user', 'new user', 'create', 'register']
  },
  {
    id: 'users-roles',
    title: 'User Roles',
    description: 'Manage user roles and permissions',
    url: '/users/roles',
    category: 'Users',
    icon: '🔐',
    keywords: ['roles', 'permissions', 'access', 'security']
  },
  {
    id: 'users-activity',
    title: 'User Activity',
    description: 'View user activity logs and audit trail',
    url: '/users/activity',
    category: 'Users',
    icon: '📋',
    keywords: ['activity', 'logs', 'audit', 'history']
  },
  {
    id: 'users-organizations',
    title: 'Organizations',
    description: 'Manage organizations and company settings',
    url: '/users/organizations',
    category: 'Users',
    icon: '🏢',
    keywords: ['organizations', 'companies', 'tenants']
  },

  // CRM
  {
    id: 'crm',
    title: 'CRM Dashboard',
    description: 'Customer relationship management overview',
    url: '/crm',
    category: 'CRM',
    icon: '🤝',
    keywords: ['crm', 'customers', 'relationships', 'sales']
  },
  {
    id: 'crm-customers',
    title: 'Customers',
    description: 'Manage customer information and contacts',
    url: '/crm/customers',
    category: 'CRM',
    icon: '👨‍💼',
    keywords: ['customers', 'clients', 'contacts']
  },
  {
    id: 'crm-leads',
    title: 'Leads',
    description: 'Track and manage sales leads',
    url: '/crm/leads',
    category: 'CRM',
    icon: '🎯',
    keywords: ['leads', 'prospects', 'potential customers']
  },
  {
    id: 'crm-opportunities',
    title: 'Opportunities',
    description: 'Manage sales opportunities and pipeline',
    url: '/crm/opportunities',
    category: 'CRM',
    icon: '💼',
    keywords: ['opportunities', 'deals', 'pipeline']
  },
  {
    id: 'crm-communication',
    title: 'Communication',
    description: 'Customer communication history',
    url: '/crm/communication',
    category: 'CRM',
    icon: '💬',
    keywords: ['communication', 'messages', 'emails']
  },
  {
    id: 'crm-feedback',
    title: 'Customer Feedback',
    description: 'Collect and manage customer feedback',
    url: '/crm/feedback',
    category: 'CRM',
    icon: '⭐',
    keywords: ['feedback', 'reviews', 'satisfaction']
  },
  {
    id: 'crm-reports',
    title: 'CRM Reports',
    description: 'CRM analytics and reporting',
    url: '/crm/reports',
    category: 'CRM',
    icon: '📈',
    keywords: ['crm reports', 'analytics', 'metrics']
  },

  // Sales
  {
    id: 'sales',
    title: 'Sales Dashboard',
    description: 'Sales overview and performance metrics',
    url: '/sales',
    category: 'Sales',
    icon: '💰',
    keywords: ['sales', 'revenue', 'performance']
  },
  {
    id: 'sales-invoices',
    title: 'Invoices',
    description: 'Create and manage invoices',
    url: '/sales/invoices',
    category: 'Sales',
    icon: '🧾',
    keywords: ['invoices', 'billing', 'payments']
  },
  {
    id: 'sales-quotations',
    title: 'Quotations',
    description: 'Create and manage sales quotations',
    url: '/sales/quotations',
    category: 'Sales',
    icon: '📄',
    keywords: ['quotations', 'quotes', 'estimates']
  },
  {
    id: 'sales-payments',
    title: 'Payments',
    description: 'Track and manage payments',
    url: '/sales/payments',
    category: 'Sales',
    icon: '💳',
    keywords: ['payments', 'transactions', 'money']
  },
  {
    id: 'sales-leads',
    title: 'Sales Leads',
    description: 'Manage sales leads and prospects',
    url: '/sales/leads',
    category: 'Sales',
    icon: '🎯',
    keywords: ['sales leads', 'prospects']
  },
  {
    id: 'sales-opportunities',
    title: 'Sales Opportunities',
    description: 'Track sales opportunities',
    url: '/sales/opportunities',
    category: 'Sales',
    icon: '🚀',
    keywords: ['sales opportunities', 'deals']
  },
  {
    id: 'sales-reports',
    title: 'Sales Reports',
    description: 'Sales analytics and reporting',
    url: '/sales/reports',
    category: 'Sales',
    icon: '📊',
    keywords: ['sales reports', 'analytics']
  },

  // Purchases
  {
    id: 'purchases',
    title: 'Purchases',
    description: 'Manage purchase orders and suppliers',
    url: '/purchases',
    category: 'Purchases',
    icon: '🛒',
    keywords: ['purchases', 'procurement', 'buying']
  },
  {
    id: 'purchases-orders',
    title: 'Purchase Orders',
    description: 'Create and manage purchase orders',
    url: '/purchases/orders',
    category: 'Purchases',
    icon: '📋',
    keywords: ['purchase orders', 'po', 'orders']
  },
  {
    id: 'purchases-suppliers',
    title: 'Suppliers',
    description: 'Manage supplier information',
    url: '/purchases/suppliers',
    category: 'Purchases',
    icon: '🏭',
    keywords: ['suppliers', 'vendors', 'partners']
  },
  {
    id: 'purchases-bills',
    title: 'Bills',
    description: 'Manage supplier bills and expenses',
    url: '/purchases/bills',
    category: 'Purchases',
    icon: '🧾',
    keywords: ['bills', 'expenses', 'payables']
  },
  {
    id: 'purchases-reports',
    title: 'Purchase Reports',
    description: 'Purchase analytics and reporting',
    url: '/purchases/reports',
    category: 'Purchases',
    icon: '📈',
    keywords: ['purchase reports', 'procurement analytics']
  },

  // Inventory
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Manage inventory and stock levels',
    url: '/inventory',
    category: 'Inventory',
    icon: '📦',
    keywords: ['inventory', 'stock', 'warehouse']
  },
  {
    id: 'inventory-products',
    title: 'Products',
    description: 'Manage product catalog',
    url: '/inventory/products',
    category: 'Inventory',
    icon: '🏷️',
    keywords: ['products', 'items', 'catalog']
  },
  {
    id: 'inventory-stock-levels',
    title: 'Stock Levels',
    description: 'Monitor stock levels and availability',
    url: '/inventory/stock-levels',
    category: 'Inventory',
    icon: '📊',
    keywords: ['stock levels', 'availability', 'quantity']
  },
  {
    id: 'inventory-movements',
    title: 'Stock Movements',
    description: 'Track inventory movements and transfers',
    url: '/inventory/movements',
    category: 'Inventory',
    icon: '🔄',
    keywords: ['movements', 'transfers', 'transactions']
  },
  {
    id: 'inventory-warehouses',
    title: 'Warehouses',
    description: 'Manage warehouse locations',
    url: '/inventory/warehouses',
    category: 'Inventory',
    icon: '🏬',
    keywords: ['warehouses', 'locations', 'storage']
  },
  {
    id: 'inventory-reports',
    title: 'Inventory Reports',
    description: 'Inventory analytics and reporting',
    url: '/inventory/reports',
    category: 'Inventory',
    icon: '📋',
    keywords: ['inventory reports', 'stock reports']
  },

  // Finance
  {
    id: 'finance',
    title: 'Finance',
    description: 'Financial management and accounting',
    url: '/finance',
    category: 'Finance',
    icon: '💼',
    keywords: ['finance', 'accounting', 'money']
  },
  {
    id: 'finance-accounts',
    title: 'Chart of Accounts',
    description: 'Manage chart of accounts',
    url: '/finance/accounts',
    category: 'Finance',
    icon: '📊',
    keywords: ['accounts', 'chart of accounts', 'ledger']
  },
  {
    id: 'finance-transactions',
    title: 'Transactions',
    description: 'View and manage financial transactions',
    url: '/finance/transactions',
    category: 'Finance',
    icon: '💳',
    keywords: ['transactions', 'journal entries']
  },
  {
    id: 'finance-budgeting',
    title: 'Budgeting',
    description: 'Create and manage budgets',
    url: '/finance/budgeting',
    category: 'Finance',
    icon: '📈',
    keywords: ['budgets', 'planning', 'forecasting']
  },
  {
    id: 'finance-reports',
    title: 'Financial Reports',
    description: 'Financial statements and reports',
    url: '/finance/reports',
    category: 'Finance',
    icon: '📋',
    keywords: ['financial reports', 'statements', 'p&l', 'balance sheet']
  },

  // HRM
  {
    id: 'hrm',
    title: 'Human Resources',
    description: 'Human resource management',
    url: '/hrm',
    category: 'HRM',
    icon: '👥',
    keywords: ['hr', 'human resources', 'employees']
  },
  {
    id: 'hrm-employees',
    title: 'Employees',
    description: 'Manage employee information',
    url: '/hrm/employees',
    category: 'HRM',
    icon: '👤',
    keywords: ['employees', 'staff', 'personnel']
  },
  {
    id: 'hrm-attendance',
    title: 'Attendance',
    description: 'Track employee attendance',
    url: '/hrm/attendance',
    category: 'HRM',
    icon: '⏰',
    keywords: ['attendance', 'time tracking', 'clock in']
  },
  {
    id: 'hrm-payroll',
    title: 'Payroll',
    description: 'Manage employee payroll',
    url: '/hrm/payroll',
    category: 'HRM',
    icon: '💰',
    keywords: ['payroll', 'salary', 'wages']
  },
  {
    id: 'hrm-recruitment',
    title: 'Recruitment',
    description: 'Manage recruitment process',
    url: '/hrm/recruitment',
    category: 'HRM',
    icon: '🎯',
    keywords: ['recruitment', 'hiring', 'candidates']
  },
  {
    id: 'hrm-reports',
    title: 'HR Reports',
    description: 'HR analytics and reporting',
    url: '/hrm/reports',
    category: 'HRM',
    icon: '📊',
    keywords: ['hr reports', 'employee analytics']
  },

  // Projects
  {
    id: 'projects',
    title: 'Projects',
    description: 'Project management and tracking',
    url: '/projects',
    category: 'Projects',
    icon: '📋',
    keywords: ['projects', 'management', 'tasks']
  },
  {
    id: 'projects-tasks',
    title: 'Tasks',
    description: 'Manage project tasks',
    url: '/projects/tasks',
    category: 'Projects',
    icon: '✅',
    keywords: ['tasks', 'todo', 'assignments']
  },
  {
    id: 'projects-time-tracking',
    title: 'Time Tracking',
    description: 'Track time spent on projects',
    url: '/projects/time-tracking',
    category: 'Projects',
    icon: '⏱️',
    keywords: ['time tracking', 'hours', 'timesheet']
  },
  {
    id: 'projects-reports',
    title: 'Project Reports',
    description: 'Project analytics and reporting',
    url: '/projects/reports',
    category: 'Projects',
    icon: '📈',
    keywords: ['project reports', 'analytics']
  },

  // AI Features
  {
    id: 'ai',
    title: 'AI Dashboard',
    description: 'Artificial intelligence features and insights',
    url: '/ai',
    category: 'AI',
    icon: '🤖',
    keywords: ['ai', 'artificial intelligence', 'automation']
  },
  {
    id: 'ai-chat',
    title: 'AI Chat',
    description: 'Chat with AI assistant',
    url: '/ai/chat',
    category: 'AI',
    icon: '💬',
    keywords: ['ai chat', 'assistant', 'chatbot']
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    description: 'AI-powered business insights',
    url: '/ai/insights',
    category: 'AI',
    icon: '🔍',
    keywords: ['insights', 'analytics', 'predictions']
  },
  {
    id: 'ai-automation',
    title: 'Automation',
    description: 'Automated workflows and processes',
    url: '/ai/automation',
    category: 'AI',
    icon: '⚙️',
    keywords: ['automation', 'workflows', 'processes']
  },
  {
    id: 'ai-alerts',
    title: 'AI Alerts',
    description: 'Intelligent alerts and notifications',
    url: '/ai/alerts',
    category: 'AI',
    icon: '🚨',
    keywords: ['alerts', 'notifications', 'warnings']
  },

  // Reports
  {
    id: 'reports',
    title: 'Reports',
    description: 'Business reports and analytics',
    url: '/reports',
    category: 'Reports',
    icon: '📊',
    keywords: ['reports', 'analytics', 'business intelligence']
  },
  {
    id: 'reports-standard',
    title: 'Standard Reports',
    description: 'Pre-built standard reports',
    url: '/reports/standard',
    category: 'Reports',
    icon: '📋',
    keywords: ['standard reports', 'templates']
  },
  {
    id: 'reports-custom',
    title: 'Custom Reports',
    description: 'Create custom reports',
    url: '/reports/custom',
    category: 'Reports',
    icon: '🛠️',
    keywords: ['custom reports', 'builder']
  },
  {
    id: 'reports-scheduled',
    title: 'Scheduled Reports',
    description: 'Automated scheduled reports',
    url: '/reports/scheduled',
    category: 'Reports',
    icon: '⏰',
    keywords: ['scheduled reports', 'automated']
  },

  // Settings
  {
    id: 'settings',
    title: 'Settings',
    description: 'System settings and configuration',
    url: '/settings',
    category: 'Settings',
    icon: '⚙️',
    keywords: ['settings', 'configuration', 'preferences']
  },
  {
    id: 'settings-system',
    title: 'System Settings',
    description: 'System-wide configuration',
    url: '/settings/system',
    category: 'Settings',
    icon: '🖥️',
    keywords: ['system settings', 'configuration']
  },
  {
    id: 'settings-integrations',
    title: 'Integrations',
    description: 'Third-party integrations',
    url: '/settings/integrations',
    category: 'Settings',
    icon: '🔗',
    keywords: ['integrations', 'api', 'third-party']
  },
  {
    id: 'settings-data',
    title: 'Data Management',
    description: 'Data import/export and backup',
    url: '/settings/data',
    category: 'Settings',
    icon: '💾',
    keywords: ['data', 'import', 'export', 'backup']
  },

  // Other Pages
  {
    id: 'profile',
    title: 'Profile',
    description: 'User profile and account settings',
    url: '/profile',
    category: 'Account',
    icon: '👤',
    keywords: ['profile', 'account', 'personal']
  },
  {
    id: 'calendar',
    title: 'Calendar',
    description: 'Calendar and scheduling',
    url: '/calendar',
    category: 'Tools',
    icon: '📅',
    keywords: ['calendar', 'schedule', 'events']
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Document management system',
    url: '/documents',
    category: 'Tools',
    icon: '📁',
    keywords: ['documents', 'files', 'storage']
  },
  {
    id: 'inbox',
    title: 'Inbox',
    description: 'Messages and communications',
    url: '/inbox',
    category: 'Communication',
    icon: '📧',
    keywords: ['inbox', 'messages', 'mail']
  },

  // Test Pages
  {
    id: 'test-search',
    title: 'Search Test',
    description: 'Test the search functionality',
    url: '/test-search',
    category: 'Tools',
    icon: '🔍',
    keywords: ['test', 'search', 'demo']
  }
];

// Search categories with styling
export const searchCategories: Record<string, SearchCategory> = {
  'Dashboard': { name: 'Dashboard', icon: '📊', color: 'bg-blue-100 text-blue-800' },
  'Users': { name: 'Users', icon: '👥', color: 'bg-green-100 text-green-800' },
  'CRM': { name: 'CRM', icon: '🤝', color: 'bg-purple-100 text-purple-800' },
  'Sales': { name: 'Sales', icon: '💰', color: 'bg-yellow-100 text-yellow-800' },
  'Purchases': { name: 'Purchases', icon: '🛒', color: 'bg-orange-100 text-orange-800' },
  'Inventory': { name: 'Inventory', icon: '📦', color: 'bg-indigo-100 text-indigo-800' },
  'Finance': { name: 'Finance', icon: '💼', color: 'bg-emerald-100 text-emerald-800' },
  'HRM': { name: 'HRM', icon: '👥', color: 'bg-pink-100 text-pink-800' },
  'Projects': { name: 'Projects', icon: '📋', color: 'bg-cyan-100 text-cyan-800' },
  'AI': { name: 'AI', icon: '🤖', color: 'bg-violet-100 text-violet-800' },
  'Reports': { name: 'Reports', icon: '📊', color: 'bg-slate-100 text-slate-800' },
  'Settings': { name: 'Settings', icon: '⚙️', color: 'bg-gray-100 text-gray-800' },
  'Account': { name: 'Account', icon: '👤', color: 'bg-teal-100 text-teal-800' },
  'Tools': { name: 'Tools', icon: '🛠️', color: 'bg-amber-100 text-amber-800' },
  'Communication': { name: 'Communication', icon: '💬', color: 'bg-rose-100 text-rose-800' }
};

export class SearchService {
  private static instance: SearchService;
  private searchIndex: SearchResult[] = searchData;

  private constructor() { }

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  // Main search function with fuzzy matching
  public search(query: string, limit: number = 10): SearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: Array<SearchResult & { score: number }> = [];

    this.searchIndex.forEach(item => {
      const score = this.calculateRelevanceScore(item, normalizedQuery);
      if (score > 0) {
        results.push({ ...item, score });
      }
    });

    // Sort by relevance score (higher is better)
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  // Calculate relevance score for search results
  private calculateRelevanceScore(item: SearchResult, query: string): number {
    let score = 0;
    const queryWords = query.split(' ').filter(word => word.length > 0);

    queryWords.forEach(queryWord => {
      // Exact title match (highest priority)
      if (item.title.toLowerCase().includes(queryWord)) {
        score += 10;
      }

      // Exact description match
      if (item.description.toLowerCase().includes(queryWord)) {
        score += 5;
      }

      // Category match
      if (item.category.toLowerCase().includes(queryWord)) {
        score += 3;
      }

      // Keywords match
      if (item.keywords) {
        item.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(queryWord)) {
            score += 2;
          }
        });
      }

      // Fuzzy matching for typos (simple implementation)
      if (this.fuzzyMatch(item.title.toLowerCase(), queryWord) ||
        this.fuzzyMatch(item.description.toLowerCase(), queryWord)) {
        score += 1;
      }
    });

    return score;
  }

  // Simple fuzzy matching for typos
  private fuzzyMatch(text: string, query: string): boolean {
    if (query.length < 3) return false;

    // Check if query is a substring with 1 character difference
    for (let i = 0; i <= text.length - query.length; i++) {
      const substring = text.substring(i, i + query.length);
      let differences = 0;

      for (let j = 0; j < query.length; j++) {
        if (substring[j] !== query[j]) {
          differences++;
        }
      }

      if (differences <= 1) {
        return true;
      }
    }

    return false;
  }

  // Get search suggestions based on popular searches
  public getPopularSearches(limit: number = 5): SearchResult[] {
    const popular = [
      'dashboard',
      'users',
      'crm',
      'sales',
      'inventory'
    ];

    return popular
      .map(id => this.searchIndex.find(item => item.id === id))
      .filter(Boolean)
      .slice(0, limit) as SearchResult[];
  }

  // Get all categories
  public getCategories(): SearchCategory[] {
    return Object.values(searchCategories);
  }

  // Search by category
  public searchByCategory(category: string, limit: number = 10): SearchResult[] {
    return this.searchIndex
      .filter(item => item.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  }
}