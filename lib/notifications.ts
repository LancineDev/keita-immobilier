import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore"
// import { sendPropertyNotificationEmail, sendContactNotificationEmail } from "@/lib/email"

export type Notification = {
  id?: string
  userId: string
  title: string
  message: string
  type: "property-new" | "user-registered" | "message-received" | "system"
  data?: any
  read: boolean
  createdAt?: any
}

export const createNotification = async (notification: Omit<Notification, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      ...notification,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

export const notifyAllUsers = async (title: string, message: string, data?: any) => {
  try {
    const usersSnap = await getDocs(collection(db, "users"))
    const notifications: Promise<string>[] = []
    const emailPromises: Promise<boolean>[] = []

    usersSnap.forEach((doc) => {
      const userData = doc.data()
      const userEmail = userData.email
      const userName = userData.name || userData.displayName || "Utilisateur"

      // Create in-app notification
      notifications.push(
        createNotification({
          userId: doc.id,
          title,
          message,
          type: "property-new",
          data,
          read: false,
        })
      )

      // Send email notification for new properties
      if (userEmail && data && typeof window === 'undefined') {
        emailPromises.push(
          fetch('/api/notifications/send-property-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userEmail,
              userName,
              propertyTitle: data.propertyTitle || title.replace("🏠 Nouvelle Propriété: ", ""),
              price: data.price || data.propertyPrice || "Prix sur demande",
              location: data.location || data.propertyLocation || "Localisation à confirmer"
            })
          }).then(res => res.json()).then(data => data.success)
        )
      }
    })

    await Promise.all(notifications)
    console.log(`In-app notifications sent to ${usersSnap.size} users`)

    // Send emails asynchronously (don't wait for completion to avoid blocking)
    if (emailPromises.length > 0) {
      Promise.all(emailPromises).then((results) => {
        const successCount = results.filter(result => result).length
        console.log(`Email notifications sent to ${successCount}/${emailPromises.length} users`)
      }).catch((error) => {
        console.error("Error sending email notifications:", error)
      })
    }

  } catch (error) {
    console.error("Error notifying users:", error)
    throw error
  }
}

export const notifyAdmin = async (title: string, message: string, type: Notification["type"], data?: any) => {
  try {
    const ADMIN_EMAIL = "keitaimmobilier@gmail.com"
    const adminSnap = await getDocs(
      query(collection(db, "users"), where("email", "==", ADMIN_EMAIL))
    )

    if (adminSnap.empty) {
      console.warn("Admin user not found")
      return
    }

    const adminId = adminSnap.docs[0].id
    const adminData = adminSnap.docs[0].data()

    // Create in-app notification
    await createNotification({
      userId: adminId,
      title,
      message,
      type,
      data,
      read: false,
    })

    console.log("Admin in-app notification sent")

    // Send email notification for contact messages
    if (type === "message-received" && data && typeof window === 'undefined') {
      try {
        const response = await fetch('/api/notifications/send-contact-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adminEmail: ADMIN_EMAIL,
            contactName: data.contactName || data.name || "Contact",
            contactEmail: data.email || data.contactEmail || "",
            contactPhone: data.telephone || data.phone || "",
            subject: data.subject || data.sujet || "Message de contact",
            message: data.message || data.contactMessage || ""
          })
        })
        const result = await response.json()
        if (result.success) {
          console.log("Admin email notification sent")
        } else {
          console.error("Failed to send admin email notification")
        }
      } catch (emailError) {
        console.error("Error sending admin email notification:", emailError)
      }
    }
  } catch (error) {
    console.error("Error notifying admin:", error)
    throw error
  }
}
