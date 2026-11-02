// api/login.js
import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, password } = req.body || {};

  // Set ADMIN_USER and ADMIN_PASS in your Vercel Project Settings -> Environment Variables
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'secretpassword';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const sessionCookie = cookie.serialize('session', 'authenticated_user', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400, // 1 day
    });

    res.setHeader('Set-Cookie', sessionCookie);
    return res.status(200).json({ success: true, message: 'Logged in successfully' });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
}
