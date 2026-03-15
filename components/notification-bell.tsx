"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Bell, X, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Notification = {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: any
}

export function NotificationBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/notifications?userId=${user.uid}&limit=10`
        )
        const data = await res.json()
        if (data.success) {
          setNotifications(data.notifications)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, read: true }),
      })
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "property-new":
        return "🏠"
      case "user-registered":
        return "👤"
      case "message-received":
        return "💬"
      default:
        return "📢"
    }
  }

  const formatDate = (date: any) => {
    if (!date) return ""
    const d = date?.toDate?.() || new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes}m`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return d.toLocaleDateString("fr-FR")
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <motion.div
            animate={{ scale: unreadCount > 0 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.div>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {unreadCount} non lus
            </p>
          )}
        </div>

        <AnimatePresence>
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin">
                <Bell className="w-5 h-5" />
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markAsRead(notification.id)}
                className={`p-3 border-b cursor-pointer transition-colors ${
                  !notification.read
                    ? "bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <div className="flex gap-3">
                  <div className="text-xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm truncate">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {notifications.length > 0 && (
          <div className="p-3 border-t text-center text-xs text-primary hover:text-primary/80 cursor-pointer font-medium">
            Voir tous les messages
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
