import { APIErrorCode, ClientErrorCode, isNotionClientError } from '@notionhq/client'

export default defineEventHandler<{
  query: {
    page?: string
    page_size?: string
  }
}>(async (event) => {
  const { page, page_size } = getQuery(event)

  const currentPage = page ? Number.parseInt(page) : 1
  const pageSize = page_size ? Number.parseInt(page_size) : 10

  try {
    return await getInstructorsAsync(null, currentPage, pageSize, false)
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
