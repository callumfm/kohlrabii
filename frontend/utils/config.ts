const isPreview = process.env.VERCEL_ENV === "preview"
const vercelURL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined

const webURL: URL = isPreview && vercelURL
    ? new URL(vercelURL)
    : new URL(process.env.NEXT_PUBLIC_WEBSITE_URL!)

const webProtocol: string = webURL.protocol
const webDomain: string = webURL.host
const dashboardDomain: string = isPreview
    ? webDomain
    : `dashboard.${webDomain}`

const dashboardURL: string = isPreview
    ? `${webProtocol}//${webDomain}/dashboard`
    : `${webProtocol}//${dashboardDomain}`

const supabaseBucketURL: string = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`

export const CONFIG = {
    CURRENT_SEASON: "2324",
    WEB_DOMAIN: webDomain,
    WEB_URL: webURL.toString(),
    DASHBOARD_DOMAIN: dashboardDomain,
    DASHBOARD_URL: dashboardURL,
    IS_PREVIEW: isPreview,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SUPABASE_BUCKET_URL: supabaseBucketURL,
}

console.log(CONFIG)
