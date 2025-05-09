const isPreview = process.env.VERCEL_ENV === "preview"
let webURL: URL = new URL(process.env.NEXT_PUBLIC_WEBSITE_URL!)

if (isPreview && process.env.VERCEL_URL) {
    webURL = new URL(`https://${process.env.VERCEL_URL}`)
}

const webDomain: string = webURL.host
const dashboardDomain: string = isPreview ? webDomain : `dashboard.${webDomain}`
const dashboardURL: string = isPreview ? `${webURL.protocol}//${webDomain}/dashboard` : `${webURL.protocol}//${dashboardDomain}`
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
