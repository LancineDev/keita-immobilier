import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Create transporter
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  }

  console.log('Creating transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user ? '***SET***' : 'NOT SET'
  })

  return nodemailer.createTransport(config)
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    console.log('Attempting to send email to:', options.to)
    console.log('Email config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      user: process.env.EMAIL_USER ? '***configured***' : 'NOT SET',
      pass: process.env.EMAIL_PASS ? '***configured***' : 'NOT SET'
    })

    const transporter = createTransporter()

    const mailOptions = {
      from: `"Keita Immobilier" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    console.log('Sending email with options:', { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject })

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return true
  } catch (err) {
    const error = err as Error & { code?: string; response?: string }
    console.error('Error sending email:', error)
    console.error('Error code:', error.code)
    console.error('Error response:', error.response)
    console.error('Error message:', error.message)
    return false
  }
}

export const sendPropertyNotificationEmail = async (
  userEmail: string,
  userName: string,
  propertyTitle: string,
  propertyPrice: string,
  propertyLocation: string
): Promise<boolean> => {
  const subject = `🏠 Nouvelle Propriété Disponible - ${propertyTitle}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h1 style="color: #2563eb; margin: 0;">Keita Immobilier</h1>
        <p style="color: #6b7280; margin: 5px 0;">Votre référence en immobilier depuis 1995</p>
      </div>

      <div style="padding: 30px 20px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Bonjour ${userName},</h2>

        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
          Une nouvelle propriété vient d'être ajoutée à notre catalogue !
        </p>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0;">${propertyTitle}</h3>
          <p style="color: #2563eb; font-weight: bold; font-size: 18px; margin: 10px 0;">${propertyPrice}</p>
          <p style="color: #6b7280; margin: 10px 0;">📍 ${propertyLocation}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://keita-immobilier.com'}"
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Voir la Propriété
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Cordialement,<br>
          <strong>L'équipe Keita Immobilier</strong>
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>Keita Immobilier - Votre référence en immobilier depuis 1995</p>
        <p>Ne répondez pas à cet email automatique</p>
      </div>
    </div>
  `

  return await sendEmail({
    to: userEmail,
    subject,
    html,
  })
}

export const sendContactNotificationEmail = async (
  adminEmail: string,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  subject: string,
  message: string
): Promise<boolean> => {
  const emailSubject = `💬 Nouveau Message de Contact - ${subject}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h1 style="color: #2563eb; margin: 0;">Keita Immobilier</h1>
        <p style="color: #6b7280; margin: 5px 0;">Administration - Nouveau Message</p>
      </div>

      <div style="padding: 30px 20px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Nouveau Message de Contact</h2>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>De:</strong> ${contactName}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${contactEmail}</p>
          <p style="margin: 10px 0;"><strong>Téléphone:</strong> ${contactPhone}</p>
          <p style="margin: 10px 0;"><strong>Sujet:</strong> ${subject}</p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">Message:</h3>
          <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${contactEmail}"
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Répondre au Message
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Cordialement,<br>
          <strong>Système de Notification Keita Immobilier</strong>
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>Keita Immobilier - Administration</p>
      </div>
    </div>
  `

  return await sendEmail({
    to: adminEmail,
    subject: emailSubject,
    html,
  })
}