export const getServerURL = (path?: string): string => {
  path = path || ""
  const baseURL = process.env.SERVER_API_URL
  return `${baseURL}${path}`
}
