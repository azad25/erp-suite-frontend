import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Use API Gateway instead of direct AI Copilot connection
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

// Helper function to get auth token from cookies
async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

// Helper function to make authenticated requests
async function makeAuthenticatedRequest(
  url: string,
  method: string,
  body?: any
): Promise<Response> {
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return fetch(url, options);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${API_GATEWAY_URL}/api/v1/ai/llm-settings/${pathString}`;
    
    const response = await makeAuthenticatedRequest(url, 'GET');

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');
    const body = await request.json();
    const url = `${API_GATEWAY_URL}/api/v1/ai/llm-settings/${pathString}`;
    
    const response = await makeAuthenticatedRequest(url, 'POST', body);

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');
    const body = await request.json();
    const url = `${API_GATEWAY_URL}/api/v1/ai/llm-settings/${pathString}`;
    
    const response = await makeAuthenticatedRequest(url, 'PUT', body);

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${API_GATEWAY_URL}/api/v1/ai/llm-settings/${pathString}`;
    
    const response = await makeAuthenticatedRequest(url, 'DELETE');

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete data' },
      { status: 500 }
    );
  }
}
