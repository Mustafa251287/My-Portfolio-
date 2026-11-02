
import cookie from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, password } = req.body || {};

  // Recommended: Set ADMIN_USER and ADMIN_PASS in your Vercel Project Settings -> Environment Variables
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // Serialize a secure cookie
    const sessionCookie = cookie.serialize('session', 'authenticated_user', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400, // 1 day
    });

    res.setHeader('Set-Cookie', sessionCookie);
    return.status(200).json({ success: true, message: 'Logged in successfully' });
  } else {
    return.status(401).json({ success: false, error: 'Invalid username or password' });
  }
}
