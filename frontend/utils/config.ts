let webURL: URL = new URL(process.env.NEXT_PUBLIC_WEBSITE_URL!)

if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    webURL = new URL(`https://${process.env.VERCEL_URL}`)
}

const webDomain: string = webURL.host
const dashboardDomain: string = `dashboard.${webDomain}`
const dashboardURL: string = `${webURL.protocol}//${dashboardDomain}`

export const CONFIG = {
    CURRENT_SEASON: "2324",
    WEB_DOMAIN: webDomain,
    WEB_URL: webURL.toString(),
    DASHBOARD_DOMAIN: dashboardDomain,
    DASHBOARD_URL: dashboardURL
}
