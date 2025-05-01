import { useMemo } from "react"

interface FormattedDateTimeProps {
    date: Date | string
    locale?: string
    weekday?: "long" | "short" | "narrow"
    day?: "numeric"
    month?: "long" | "short" | "narrow"
    year?: "numeric"
  }

export const FormattedDate: React.FC<FormattedDateTimeProps> = ({
    date,
    locale = "en-GB",
    weekday = "long",
    day = "numeric",
    month = "short",
    year = "numeric"
}) => {
    const formatted = useMemo(() => {
        try {
            const parseDate = new Date(date)
            const formattedDate = parseDate.toLocaleDateString(locale, {
            weekday: weekday,
            day: day,
            month: month,
            year: year
        })
        return <>{formattedDate}</>
    } catch {
        return "Invalid date"
        }
    }, [date, locale, weekday, day, month, year])

    return formatted
}
