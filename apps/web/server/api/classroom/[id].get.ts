import { APIErrorCode, ClientErrorCode, isNotionClientError } from '@notionhq/client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return null

  const refresh = event.node.req.headers['x-prerender-revalidate'] === process.env.VERCEL_BYPASS_TOKEN

  try {
    const item = await getClassroomByIdAsync(null, +id, refresh)
    if (!item) {
      const responseData = { rc: 404, rm: 'Not Found' }
      event.node.res.statusCode = responseData.rc
      return responseData
    }

    return item
  }
  catch (error: unknown) {
    if (isNotionClientError(error)) {
      // error is now strongly typed to NotionClientError
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          // ...
          break
        case APIErrorCode.ObjectNotFound:
          // ...
          break
        case APIErrorCode.Unauthorized:
          // ...
          break
      }
    }
    return error
  }
})
