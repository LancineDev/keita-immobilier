import { NextRequest, NextResponse } from "next/server"
import { initializeApp, getApps, ServiceAccount } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { credential } from "firebase-admin"

// Initialize Firebase Admin
let adminApp = getApps()[0]

if (!adminApp) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
    ) as ServiceAccount

    adminApp = initializeApp({
      credential: credential.cert(serviceAccount),
    })
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error)
  }
}

const db = getFirestore(adminApp)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, message, type, data } = body

    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields: userId, title, message, type" },
        { status: 400 }
      )
    }

    const notificationRef = await db.collection("notifications").add({
      userId,
      title,
      message,
      type,
      data: data || {},
      read: false,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      notificationId: notificationRef.id,
    })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: "Failed to create notification", details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const limit = parseInt(searchParams.get("limit") || "50")

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    let query = db
      .collection("notifications")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")

    if (unreadOnly) {
      query = query.where("read", "==", false)
    }

    const snapshot = await query.limit(limit).get()
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }))

    return NextResponse.json({
      success: true,
      notifications,
      count: notifications.length,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications", details: String(error) },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, read } = body

    if (!notificationId) {
      return NextResponse.json(
        { error: "notificationId is required" },
        { status: 400 }
      )
    }

    await db.collection("notifications").doc(notificationId).update({
      read: read === true ? true : false,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    )
  }
}
