import { NextRequest, NextResponse } from "next/server"
import { sendContactNotificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { adminEmail, contactName, contactEmail, contactPhone, subject, message } = await request.json()

    if (!adminEmail || !contactName || !contactEmail || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await sendContactNotificationEmail(
      adminEmail,
      contactName,
      contactEmail,
      contactPhone || "",
      subject,
      message
    )

    return NextResponse.json({
      success: result,
      message: result ? "Email sent successfully" : "Failed to send email"
    })
  } catch (error) {
    console.error("Error sending contact notification email:", error)
    return NextResponse.json(
      { error: "Failed to send email", details: String(error) },
      { status: 500 }
    )
  }
}