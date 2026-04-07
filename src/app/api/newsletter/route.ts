import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      // Fallback: store in console / logs if no key
      console.log(`[Newsletter] New subscriber: ${email}`)
      return NextResponse.json({ success: true, message: 'Subscribed successfully' })
    }

    if (AUDIENCE_ID) {
      // Add to Resend audience
      await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        unsubscribed: false,
      })
    } else {
      // Send via Resend transactional (no audience list)
      await resend.emails.send({
        from: 'Lost Luggage Legend <newsletter@lostluggagelegend.com>',
        to: [email],
        subject: 'Welcome to Lost Luggage Legend! 🧳',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 28px; color: #1a1814; margin-bottom: 20px;">Welcome aboard!</h1>
            <p style="font-size: 18px; color: #6b6560; line-height: 1.7;">
              You're now subscribed to the Lost Luggage Legend Weekly Brief — 
              practical carry-on intelligence delivered every Monday.
            </p>
            <p style="font-size: 16px; color: #6b6560; line-height: 1.7; margin-top: 20px;">
              Keep an eye on your inbox for our first edition. In the meantime, 
              if you ever lose your luggage, you now have a secret weapon.
            </p>
            <hr style="border: none; border-top: 1px solid #d9d0c4; margin: 30px 0;" />
            <p style="font-size: 13px; color: #9a9a9a;">
              Lost Luggage Legend · <a href="https://lostluggagelegend.com" style="color: #c9a96e;">lostluggagelegend.com</a>
            </p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true, message: 'Welcome aboard! Check your inbox.' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Subscription failed. Try again.' }, { status: 500 })
  }
}
