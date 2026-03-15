import { NextRequest, NextResponse } from "next/server"
import { sendPropertyNotificationEmail, sendContactNotificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { type, ...data } = await request.json()

    let result = false

    if (type === "property") {
      result = await sendPropertyNotificationEmail(
        data.email,
        data.name,
        data.propertyTitle,
        data.price,
        data.location
      )
    } else if (type === "contact") {
      result = await sendContactNotificationEmail(
        data.adminEmail,
        data.contactName,
        data.contactEmail,
        data.contactPhone,
        data.subject,
        data.message
      )
    }

    return NextResponse.json({
      success: result,
      message: result ? "Email sent successfully" : "Failed to send email"
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      { error: "Failed to send email", details: String(error) },
      { status: 500 }
    )
  }
}