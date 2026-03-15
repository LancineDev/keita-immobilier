import { NextRequest, NextResponse } from "next/server"
import { sendPropertyNotificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, propertyTitle, price, location } = await request.json()

    if (!userEmail || !userName || !propertyTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await sendPropertyNotificationEmail(
      userEmail,
      userName,
      propertyTitle,
      price || "Prix sur demande",
      location || "Localisation à confirmer"
    )

    return NextResponse.json({
      success: result,
      message: result ? "Email sent successfully" : "Failed to send email"
    })
  } catch (error) {
    console.error("Error sending property notification email:", error)
    return NextResponse.json(
      { error: "Failed to send email", details: String(error) },
      { status: 500 }
    )
  }
}