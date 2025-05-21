export const getServerURL = (path?: string): string => {
  const stringPath = path || ""
  const baseURL = process.env.SERVER_API_URL
  return `${baseURL}${stringPath}`
}
