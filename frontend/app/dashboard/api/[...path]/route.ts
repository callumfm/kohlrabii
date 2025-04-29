import { unwrap } from '@/utils/api/client'
import { getServerSideAPI } from '@/utils/client/serverside'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
    const { ...params } = Object.fromEntries(
        request.nextUrl.searchParams
    )
    const pathname = request.url.split('?')[0].replace(request.nextUrl.origin, '')
    const api = await getServerSideAPI()

    const data = await unwrap(
        api.GET(pathname as any, {
            params: {
                query: {
                    ...params,
                },
            },
        })
    )

    return NextResponse.json(data, {
        status: data.status,
    })
}
