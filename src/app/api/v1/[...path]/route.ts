import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  // Extract everything after /api/v1/
  const idx = url.pathname.indexOf('/api/v1/');
  const targetPath = idx >= 0 ? url.pathname.slice(idx + '/api/v1/'.length) : '';
  const targetUrl = `${API_BASE.replace(/\/$/, '')}/api/v1/${targetPath}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('host', new URL(API_BASE).host);

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
    cache: 'no-store',
  };

  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  try {
    const resp = await fetch(targetUrl, init);
    const respHeaders = new Headers(resp.headers);
    respHeaders.delete('transfer-encoding');
    return new NextResponse(resp.body, {
      status: resp.status,
      headers: respHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upstream unavailable', details: (error as Error).message },
      { status: 502 }
    );
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as HEAD, proxy as OPTIONS };


