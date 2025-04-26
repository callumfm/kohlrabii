const getBaseURL = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    const vercelURL = process.env.NEXT_PUBLIC_VERCEL_URL
    if (vercelURL) {
      return `https://${vercelURL}`
    }
    return process.env.NEXT_PUBLIC_WEBSITE_URL!
}

const webURL: URL = new URL(getBaseURL())
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
