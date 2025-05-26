const toastKeyMap: { [key: string]: string[] } = {
  status: ["status", "status_description"],
  error: ["error", "error_description"],
}

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription = "",
  disableButton = false,
  arbitraryParams = "",
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType]

  let redirectPath = `${path}?toast=true&${nameKey}=${encodeURIComponent(toastName)}`

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`
  }

  if (disableButton) {
    redirectPath += "&disable_button=true"
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`
  }

  return redirectPath
}

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription = "",
  disableButton = false,
  arbitraryParams = "",
) =>
  getToastRedirect(
    path,
    "status",
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams,
  )

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription = "",
  disableButton = false,
  arbitraryParams = "",
) =>
  getToastRedirect(
    path,
    "error",
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams,
  )
