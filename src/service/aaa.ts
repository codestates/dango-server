class HTTPError extends Error {
  constructor(statusCode: number, message?: string) {
    super(message) // 반드시 호출해야함
    this.name = `HTTPError`
  }
}
const fetchPosts = async () => {
  const response = await fetch(`/api/posts`)
  if (response.ok) {
    return await response.json()
  } else {
    throw new HTTPError(response.status, response.statusText)
  }
}
const renderPosts = async () => {
  try {
    const posts = await fetchPosts()
    // Do something with posts
  } catch (e) {
    console.error(e.statusCode) // <- 컴파일 에러
    if (e instanceof HTTPError) {
      alert(`fetching posts failed, error code is ...}`) // 이건 정상
    }
  }
}