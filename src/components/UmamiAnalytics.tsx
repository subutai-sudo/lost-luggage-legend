/**
 * Only production builds emit analytics. Keep previews and local development
 * silent; the hostname allowlist also protects production deployment URLs.
 * Rebuild for production rather than promoting a preview-built artifact.
 * The website ID is a public tracker identifier, not an API credential.
 */
export default function UmamiAnalytics() {
  if (process.env.VERCEL_ENV !== 'production') return null

  return (
    <script
      defer
      src="https://umami.scheduledloss.com/script.js"
      data-website-id="0da19096-85a8-4489-b246-9151fa113f5b"
      data-domains="lostluggagelegend.com,www.lostluggagelegend.com"
      data-do-not-track="true"
      data-exclude-search="true"
      data-exclude-hash="true"
    />
  )
}
