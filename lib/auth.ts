// lib/auth.ts
import { serialize } from 'cookie'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { EncryptJWT, jwtDecrypt, JWTPayload } from 'jose'
import { Role } from '@prisma/client'

// Constants
const SECRET_KEY = process.env.JWT_SECRET
const ACCESS_MAX_AGE = 60 * 60 * 24 * 2 // 2 days for encrypted JWT
const COOKIE_NAME = 'access_token'

// Validate environment variable
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET must be defined')
}

// Generate AES encryption key
const secret = Buffer.from(SECRET_KEY, 'hex')

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function generateEncryptedToken(user: { id: string, role: Role, partnerId: string }) {
  return await new EncryptJWT({ user })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_MAX_AGE}s`)
    .encrypt(secret)
}

export async function verifyEncryptedToken(token: string) {
  try {
    const { payload } = await jwtDecrypt(token, secret)
    return payload as JWTPayload & { user: { id: string, role: Role ,partnerId: string} }
  } catch (error) {
    console.log('Token verification error:', error)
    return null
  }
}

export function setEncryptedAuthCookie(response: NextResponse, token: string) {
  const cookie = serialize(COOKIE_NAME, token, {
    maxAge: ACCESS_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' 
      ? process.env.COOKIE_DOMAIN 
      : undefined
  })

  // For NextResponse, we need to set the header directly
  response.headers.append('Set-Cookie', cookie)
  return response
}

export function clearAuthCookies(response: NextResponse) {
  const cookies = [
    serialize(COOKIE_NAME, '', {
      maxAge: -1,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.NODE_ENV === 'production' 
        ? process.env.COOKIE_DOMAIN 
        : undefined
    }),
    serialize('deviceId', '', {
      maxAge: -1,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.NODE_ENV === 'production' 
        ? process.env.COOKIE_DOMAIN 
        : undefined
    })
  ]

  // Set multiple cookies in NextResponse
  cookies.forEach(cookie => {
    response.headers.append('Set-Cookie', cookie)
  })
  return response
}

// Optional: Keep the old functions for backward compatibility or remove them
export async function generateToken(user: { id: string , role: Role, partnerId: string}) {
  return await generateEncryptedToken(user)
}

export function setTokenCookieApp(response: NextResponse, token: string) {
  return setEncryptedAuthCookie(response, token)
}

export function clearTokenCookie(response: NextResponse) {
  return clearAuthCookies(response)
}

export async function verifyToken(token: string) {
  const payload = await verifyEncryptedToken(token)
  if (payload && payload.user) {
    return payload.user as UserAuthPayload
  }
  return null
}

// Type definitions
interface UserAuthPayload {
  id: string
  role: Role
  partnerId: string
}