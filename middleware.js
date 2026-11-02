import { next } from '@vercel/functions';

export default function middleware(request) {
  const url = new URL(request.url);

  const cookieHeader = request.headers.get('cookie') || '';
  
  // Check for the authentication cookie
  if (!cookieHeader.includes('session=authenticated_user')) {
    const loginUrl = new URL('/login.html', request.url);
    return Response.redirect(loginUrl, 302);
  }

  // Allow the request to proceed normally if authenticated
  return next();
}

// THIS IS THE KEY: This matcher ensures the middleware ONLY runs 
// on these exact paths and completely ignores every other page.
export const config = {
  matcher: ['/edit.html', '/edit'],
};
