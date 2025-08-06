# User Management Implementation Guide

## Overview

The user management system is fully implemented with GraphQL service integration through the API Gateway. The system provides a complete user management interface with real-time data from the backend services.

## Architecture

```
Frontend Components → User Management Service → GraphQL Service → API Gateway → Backend Services
```

### Key Components

1. **GraphQL Service** (`src/services/graphql.ts`)
   - Maps GraphQL queries to REST API endpoints
   - Handles data transformation between frontend and backend formats
   - Provides error handling and graceful degradation

2. **User Management Service** (`src/services/userManagement.ts`)
   - High-level service layer for user operations
   - Integrates with GraphQL service and WebSocket for real-time updates
   - Provides authentication and CRUD operations

3. **UI Components** (`src/components/user-management/`)
   - `UserManagementDashboard.tsx` - Overview dashboard with statistics
   - `UserListTable.tsx` - User listing with CRUD operations
   - `UserActivityLog.tsx` - Activity monitoring
   - `UserRolesManagement.tsx` - Role and permission management

## API Endpoints

The system connects to the following API Gateway endpoints:

### User Management
- `GET /api/v1/users` - List users with pagination and search
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user
- `POST /api/v1/users/{id}/activate` - Activate user
- `POST /api/v1/users/{id}/deactivate` - Deactivate user
- `POST /api/v1/users/{id}/verify` - Verify user

### Statistics
- `GET /api/v1/users/stats` - User statistics
- `GET /api/v1/users/security-stats` - Security statistics
- `GET /api/v1/users/activity` - User activity logs

### Roles & Permissions
- `GET /api/v1/roles` - List roles
- `GET /api/v1/permissions` - List permissions
- `POST /api/v1/roles` - Create role
- `PUT /api/v1/roles/{id}` - Update role
- `DELETE /api/v1/roles/{id}` - Delete role

## Configuration

The system uses runtime configuration to connect to the API Gateway:

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost
NEXT_PUBLIC_GRAPHQL_URL=http://localhost/graphql
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost/socket.io
```

### Runtime Config
The system fetches configuration from `/api/config` endpoint, which provides:
- API URLs for different services
- Feature flags
- WebSocket configuration

## Features

### Dashboard
- User statistics (total, active, inactive, verified, unverified)
- Security metrics (failed logins, locked accounts, alerts)
- Recent activity feed
- Quick action links

### User Management
- User listing with search and pagination
- User profile viewing
- User creation, editing, and deletion
- User activation/deactivation
- User verification

### Activity Monitoring
- Real-time activity logs
- Activity filtering and search
- User-specific activity tracking
- Security event monitoring

### Role Management
- Role listing and management
- Permission assignment
- System vs custom role distinction
- Role-based access control

## Error Handling

The system implements comprehensive error handling:

1. **Network Errors**: Graceful degradation with fallback data
2. **API Errors**: User-friendly error messages
3. **Loading States**: Loading indicators during data fetching
4. **Empty States**: Appropriate messaging when no data is available

## Testing

### API Connection Test
Visit `/test-api` to verify API Gateway connectivity:
- Tests all major endpoints
- Shows success/failure status
- Displays actual API responses
- Helps debug connection issues

### Manual Testing
1. Navigate to `/users` to see the user management dashboard
2. Try creating, editing, and deleting users
3. Check activity logs at `/users/activity`
4. Manage roles at `/users/roles`

## Data Flow

### User Listing
1. Component calls `userManagementService.getUsers()`
2. Service calls `graphqlService.request(GET_USERS, variables)`
3. GraphQL service maps to `GET /api/v1/users`
4. API Gateway routes to appropriate backend service
5. Response is transformed and returned to component

### User Creation
1. Form submission triggers `userManagementService.createUser()`
2. Service calls `graphqlService.request(CREATE_USER, variables)`
3. GraphQL service maps to `POST /api/v1/users`
4. Success/error response is handled and displayed

## Real-time Updates

The system supports real-time updates via WebSocket:
- User status changes
- Activity logs
- Security alerts
- System notifications

## Security

- JWT token authentication
- Role-based access control
- Activity logging
- Security event monitoring
- Failed login tracking

## Troubleshooting

### Common Issues

1. **No Data Loading**
   - Check API Gateway is running
   - Verify environment variables
   - Check browser network tab for failed requests

2. **Authentication Errors**
   - Ensure user is logged in
   - Check JWT token validity
   - Verify API Gateway authentication

3. **Permission Errors**
   - Check user roles and permissions
   - Verify role assignments
   - Check backend authorization

### Debug Steps

1. Visit `/test-api` to test API connectivity
2. Check browser console for errors
3. Verify network requests in browser dev tools
4. Check API Gateway logs
5. Verify backend service status

## Development

### Adding New Features

1. Add GraphQL query/mutation to `graphql.ts`
2. Map to appropriate REST endpoint
3. Add service method to `userManagement.ts`
4. Create/update UI components
5. Add error handling and loading states

### Best Practices

1. Always handle loading and error states
2. Use TypeScript interfaces for type safety
3. Implement graceful degradation
4. Add comprehensive error messages
5. Test with real API data

## Production Deployment

1. Ensure all environment variables are set
2. Verify API Gateway is accessible
3. Test all user management features
4. Monitor error logs
5. Set up health checks

## Support

For issues or questions:
1. Check this documentation
2. Test API connectivity at `/test-api`
3. Review browser console errors
4. Check API Gateway logs
5. Verify backend service status