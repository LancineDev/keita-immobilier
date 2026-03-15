// Test email functionality
import { sendPropertyNotificationEmail } from '../lib/email'

async function testEmail() {
  try {
    const result = await sendPropertyNotificationEmail(
      'klancine011@gmail.com',
      'Keita Lancine',
      'Test Property - Appartement 3 pièces',
      '500.000 FCFA',
      'Abidjan, Cocody'
    )
    console.log('Email sent:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}

testEmail()