import { NextRequest, NextResponse } from 'next/server';

interface AIChatRequest {
  message: string;
  context?: Record<string, string>;
  session_id?: string;
}

interface AIChatResponse {
  response: string;
  message_id: string;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIChatRequest = await request.json();
    
    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // This is a fallback route when WebSocket is not available
    // In production, this should proxy to the AI Copilot service
    const aiCopilotUrl = process.env.AI_COPILOT_URL || 'http://localhost:8003';
    
    try {
      const response = await fetch(`${aiCopilotUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: body.message,
          context: body.context || {},
          session_id: body.session_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          response: data.response || data.message || "I understand your request. Let me help you with that.",
          message_id: data.message_id || `msg_${Date.now()}`,
          timestamp: Date.now(),
        });
      } else {
        throw new Error(`AI service responded with ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to connect to AI Copilot service:', error);
      
      // Fallback response when AI service is unavailable
      const fallbackResponse: AIChatResponse = {
        response: "I'm currently experiencing connectivity issues. Please try again in a moment, or check if the AI Copilot service is running.",
        message_id: `fallback_${Date.now()}`,
        timestamp: Date.now(),
      };
      
      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error('Error processing AI chat request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
