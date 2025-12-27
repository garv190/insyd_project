import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const usersPath = path.resolve('src/app/data/users.json'); // Path to your users.json

export async function POST(req) {
  const { username, password } = await req.json();

  // Load user data from JSON
  const userData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

  // Check if user is admin or regular user
  let userRole = '';
  let usersList = [];

  if (userData.admin.some((user) => user.username === username)) {
    userRole = 'admin';
    usersList = userData.admin;
  } else if (userData.user.some((user) => user.username === username)) {
    userRole = 'user';
    usersList = userData.user;
  } else {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Find the user and check password
  const user = usersList.find((u) => u.username === username);
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  // On successful login, return user role and username
  return NextResponse.json({
    message: 'Login successful',
    role: userRole,
    username: user.username,
  });
}
