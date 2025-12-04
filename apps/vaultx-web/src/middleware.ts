/**
 * @file: middleware.ts
 * @author: Raul Daramus
 * @date: 2025
 * Copyright (C) 2025 VaultX by Raul Daramus
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 *   - Share — copy and redistribute the material in any medium or format
 *   - Adapt — remix, transform, and build upon the material
 *
 * Under the following terms:
 *   - Attribution — You must give appropriate credit, provide a link to the license,
 *     and indicate if changes were made.
 *   - NonCommercial — You may not use the material for commercial purposes.
 *   - ShareAlike — If you remix, transform, or build upon the material, you must
 *     distribute your contributions under the same license as the original.
 */

import { NextRequest, NextResponse } from 'next/server';

const API_PROXY_TARGET =
  process.env.NEXT_API_PROXY_TARGET ?? 'http://localhost:3000';

export async function middleware(request: NextRequest) {
  // Only handle API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      // Build the backend URL
      const backendUrl = `${API_PROXY_TARGET}${request.nextUrl.pathname}${request.nextUrl.search}`;

      // Prepare headers for the backend request
      const headers = new Headers(request.headers);

      // Remove host and connection headers that might cause issues
      headers.delete('host');
      headers.delete('connection');

      let body: BodyInit | null = null;

      // For methods with body, read and forward it
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        const contentType = request.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          // Read JSON body
          const jsonBody = await request.json();
          body = JSON.stringify(jsonBody);
        } else {
          // For other content types, use the stream
          body = request.body;
        }
      }

      // Forward the request to the backend
      const response = await fetch(backendUrl, {
        method: request.method,
        headers,
        body,
      });

      // Return the backend response
      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch (error) {
      console.error('[Middleware] API proxy error:', error);
      return NextResponse.json(
        { error: 'Failed to proxy request to backend' },
        { status: 502 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
