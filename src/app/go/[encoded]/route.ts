import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ encoded: string }> }
) {
  const { encoded } = await params

  try {
    const destinationUrl = Buffer.from(encoded, 'base64url').toString('utf-8')

    // Basic validation - must be a valid URL
    if (!destinationUrl.startsWith('http://') && !destinationUrl.startsWith('https://')) {
      return NextResponse.redirect(new URL('/'), 302)
    }

    return NextResponse.redirect(destinationUrl, 302)
  } catch {
    // Invalid encoding - redirect to home
    return NextResponse.redirect(new URL('/'), 302)
  }
}
