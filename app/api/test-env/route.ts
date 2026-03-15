import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER ? '***SET***' : 'NOT SET',
    EMAIL_PASS: process.env.EMAIL_PASS ? '***SET***' : 'NOT SET',
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SECURE: process.env.EMAIL_SECURE
  })
}