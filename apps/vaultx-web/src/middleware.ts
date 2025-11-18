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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_PROXY_TARGET =
  process.env.NEXT_API_PROXY_TARGET ?? 'http://localhost:3000';

export function middleware(request: NextRequest) {
  // Only proxy /api/* requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const apiUrl = `${API_PROXY_TARGET}${request.nextUrl.pathname}${request.nextUrl.search}`;

    return NextResponse.rewrite(new URL(apiUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
