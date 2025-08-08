#!/usr/bin/env node

// Simple WebSocket connection test
const WebSocket = require('ws');

const wsUrl = 'ws://localhost/ws';
console.log('Testing WebSocket connection to:', wsUrl);

const ws = new WebSocket(wsUrl, {
  headers: {
    'Authorization': 'Bearer test-token'
  }
});

ws.on('open', function open() {
  console.log('✅ WebSocket connected successfully');
  
  // Subscribe to security events
  const subscribeMessage = {
    type: 'subscribe',
    data: { channel: 'events:failed_login' },
    timestamp: new Date().toISOString()
  };
  
  console.log('📡 Subscribing to security events:', subscribeMessage);
  ws.send(JSON.stringify(subscribeMessage));
  
  // Keep connection alive for a few seconds
  setTimeout(() => {
    console.log('🔌 Closing connection');
    ws.close();
  }, 5000);
});

ws.on('message', function message(data) {
  console.log('📨 Received message:', data.toString());
  try {
    const parsed = JSON.parse(data.toString());
    console.log('📋 Parsed message:', JSON.stringify(parsed, null, 2));
  } catch (e) {
    console.log('⚠️  Could not parse message as JSON');
  }
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', function close(code, reason) {
  console.log('🔌 WebSocket closed:', code, reason.toString());
});

// Timeout after 10 seconds
setTimeout(() => {
  if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
    console.log('⏰ Test timeout, closing connection');
    ws.close();
  }
  process.exit(0);
}, 10000);