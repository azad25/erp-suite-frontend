# AI Chatbot Integration - Frontend

This document describes the integration of the AI Copilot chatbot functionality into the ERP Suite frontend application.

## Overview

The AI chatbot has been integrated into two main areas:
1. **Header Widget** (`ChatbotWidget.tsx`) - A compact chat interface accessible from any page
2. **Admin AI Chat Page** (`/ai/chat`) - A full-featured chat interface in the admin section

## Features

### Real-time Communication
- **WebSocket Integration**: Direct connection to the AI Copilot service for real-time chat
- **Streaming Responses**: Support for streaming AI responses with typing indicators
- **Fallback REST API**: Automatic fallback to REST endpoints when WebSocket is unavailable

### Enhanced UI/UX
- **Dot Animation**: Beautiful animated typing indicator with staggered dots
- **Connection Status**: Real-time connection status indicator
- **Auto-scroll**: Automatic scrolling to latest messages
- **Quick Actions**: Pre-defined action buttons for common queries
- **Responsive Design**: Works on all screen sizes

### Message Handling
- **Context Awareness**: Sends context information (user, department, page) with each message
- **Session Management**: Unique session IDs for conversation tracking
- **Error Handling**: Graceful fallback and error messages
- **Message Persistence**: Chat history maintained during session

## Architecture

### Components

#### ChatbotWidget.tsx
- **Location**: `src/components/header/ChatbotWidget.tsx`
- **Purpose**: Compact chat interface in the header
- **Features**: 
  - Toggle open/close
  - Quick reply suggestions
  - Connection status
  - Typing indicators

#### AI Chat Page
- **Location**: `src/app/(admin)/ai/chat/page.tsx`
- **Purpose**: Full-featured chat interface
- **Features**:
  - Full chat history
  - Quick action buttons
  - Clear chat functionality
  - Enhanced message display

### Configuration

#### AI Config (`src/config/ai-config.ts`)
```typescript
export const AI_CONFIG = {
  WEBSOCKET_URL: 'ws://localhost:8080/ws',
  AI_COPILOT_URL: 'http://localhost:8003',
  API_GATEWAY_URL: 'http://localhost:8080',
  // ... other settings
};
```

#### Environment Variables
```bash
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080/ws
NEXT_PUBLIC_AI_COPILOT_URL=http://localhost:8003
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
```

### API Routes

#### Fallback REST API (`/api/ai/chat`)
- **Purpose**: Handles chat requests when WebSocket is unavailable
- **Location**: `src/app/api/ai/chat/route.ts`
- **Features**: 
  - Proxies to AI Copilot service
  - Fallback responses
  - Error handling

## Integration Points

### WebSocket Messages
The chatbot sends and receives the following message types:

```typescript
// Outgoing messages
{
  type: 'ai_chat',
  data: {
    message: string,
    context: Record<string, string>,
    session_id: string
  },
  timestamp: string
}

// Incoming messages
{
  type: 'ai_chat' | 'ai_stream' | 'ai_status',
  data: AIChatResponse | AIStreamResponse | AIStatusResponse
}
```

### Context Information
Each message includes context for better AI responses:
```typescript
{
  user_id: 'current_user',
  department: 'admin' | 'sales' | 'general',
  page: 'ai_chat' | 'dashboard',
  application: 'erp-suite',
  version: '1.0.0'
}
```

## Usage

### Starting a Chat
1. **Header Widget**: Click the AI Copilot icon in the header
2. **Admin Page**: Navigate to `/ai/chat` in the admin section

### Sending Messages
- Type your message and press Enter or click Send
- Use quick action buttons for common queries
- Messages are sent with context information

### Quick Actions
Pre-defined actions for common ERP tasks:
- Show sales dashboard
- Generate inventory report
- List overdue invoices
- Show top customers
- Check cash flow
- Schedule meeting

## Dependencies

### Required Services
- **AI Copilot Service**: Running on port 8003
- **API Gateway**: Running on port 8080
- **WebSocket Support**: For real-time communication

### Frontend Dependencies
- React hooks (`useState`, `useRef`, `useEffect`, `useCallback`)
- Next.js API routes
- Tailwind CSS for styling
- Custom icons (`CopilotUIIcon`, `PaperPlaneIcon`)

## Development

### Local Development
1. Ensure AI Copilot service is running on port 8003
2. Ensure API Gateway is running on port 8080
3. Set environment variables in `.env.local`
4. Start the frontend development server

### Testing
1. **WebSocket Connection**: Check connection status indicator
2. **Message Sending**: Send test messages and verify responses
3. **Fallback API**: Test with WebSocket disabled
4. **Error Handling**: Test with services unavailable

### Debugging
- Check browser console for WebSocket connection logs
- Verify environment variables are set correctly
- Check network tab for API requests
- Monitor WebSocket connection status

## Future Enhancements

### Planned Features
- **User Authentication**: Integrate with auth system for user context
- **Chat History**: Persistent chat history across sessions
- **File Uploads**: Support for document analysis
- **Voice Input**: Speech-to-text capabilities
- **Multi-language**: Internationalization support

### Technical Improvements
- **Connection Pooling**: Better WebSocket connection management
- **Message Queuing**: Offline message handling
- **Performance**: Optimize for large chat histories
- **Accessibility**: Enhanced screen reader support

## Troubleshooting

### Common Issues

#### WebSocket Connection Failed
- Check if AI Copilot service is running
- Verify WebSocket URL in configuration
- Check firewall/network settings

#### Messages Not Sending
- Verify connection status
- Check browser console for errors
- Ensure input is not disabled

#### No AI Responses
- Check AI Copilot service health
- Verify message format
- Check API Gateway configuration

### Debug Steps
1. Check browser console for errors
2. Verify service endpoints are accessible
3. Test WebSocket connection manually
4. Check environment variables
5. Verify API route functionality

## Support

For technical support or questions about the AI chatbot integration:
1. Check the browser console for error messages
2. Verify all required services are running
3. Check the configuration files
4. Review the WebSocket connection status
5. Test the fallback REST API endpoints
