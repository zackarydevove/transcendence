

const createUrl = (path: string) => {
  const baseUrl = typeof window === "undefined" // SSR internal docker network
    ? process.env.BACKEND_URL
    : process.env.NEXT_PUBLIC_BACKEND_URL
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined')
  }
  return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`
}

export default createUrl