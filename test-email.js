import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testEmail() {
  try {
    console.log('Testing email configuration...')
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST)
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT)
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '***SET***' : 'NOT SET')
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET')
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM)

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // false for TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Verify connection
    console.log('Verifying connection...')
    await transporter.verify()
    console.log('✅ SMTP connection successful!')

    // Send test email
    console.log('Sending test email...')
    const info = await transporter.sendMail({
      from: `"Keita Immobilier Test" <${process.env.EMAIL_FROM}>`,
      to: 'klancine011@gmail.com',
      subject: 'Test Email - Keita Immobilier',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>🧪 Test Email</h1>
          <p>Cette email est un test du système de notification de Keita Immobilier.</p>
          <p>Si vous recevez cette email, le système fonctionne correctement !</p>
          <br>
          <p>Cordialement,<br>L'équipe Keita Immobilier</p>
        </div>
      `
    })

    console.log('✅ Email sent successfully!')
    console.log('Message ID:', info.messageId)

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error:', error)
  }
}

testEmail()