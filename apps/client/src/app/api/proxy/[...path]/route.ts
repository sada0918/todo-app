import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://todo.g.kuroco.app';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path, 'PATCH');
}

async function handleRequest(
  request: NextRequest,
  pathParts: string[],
  method: string
) {
  const path = pathParts.join('/');
  const url = `${API_BASE_URL}/${path}`;

  console.log(`[Proxy] ${method} ${url}`);

  try {
    // リクエストボディの取得
    let body = undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch (e) {
        console.error('[Proxy] Failed to read request body:', e);
      }
    }

    // クッキーを取得
    const cookieHeader = request.headers.get('cookie');
    console.log('[Proxy] Request cookies:', cookieHeader);

    // APIリクエストのヘッダーを構築
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // クッキーを転送
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // APIリクエストを送信
    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    console.log(`[Proxy] Response status: ${response.status}`);

    // レスポンスボディの取得
    const responseBody = await response.text();
    
    // レスポンスヘッダーの構築
    const responseHeaders = new Headers();
    
    // Content-Typeをコピー
    const contentType = response.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }

    // Set-Cookieヘッダーを処理
    const setCookieHeaders = response.headers.get('set-cookie');
    if (setCookieHeaders) {
      console.log('[Proxy] Setting cookies:', setCookieHeaders);
      responseHeaders.set('set-cookie', setCookieHeaders);
    }

    // レスポンスを返す
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('[Proxy] Request failed:', error);
    return NextResponse.json(
      { error: 'プロキシリクエストに失敗しました' },
      { status: 500 }
    );
  }
}
