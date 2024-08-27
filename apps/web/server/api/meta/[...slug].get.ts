import { getMetaByPathAsync } from '~/server/service/meta/get'

export default defineWrappedResponseHandler<{
  query: {
    refresh?: boolean
    ssr?: boolean
  }
}>(async (event) => {
  const fullPath = getRouterParam(event, 'slug')

  if (!fullPath) {
    setResponseStatus(event, ErrorCodes.BAD_REQUEST)
    return createApiError(event.node.res.statusCode, '請傳入路由')
  }

  const { refresh: r } = getQuery(event)
  const config = useRuntimeConfig()
  const refresh = event.node.req.headers['x-prerender-revalidate'] === config.vercel.bypassToken || (config.public.isDev && !!r)
  const ssr = event.node.req.headers['x-ssr-cache']
  console.log(`[GET] /api/meta/${fullPath}`, { refresh, ssr })

  const items = await getMetaByPathAsync(null, fullPath, refresh, !!ssr)
  return createApiResponse(200, 'OK', items)
})
