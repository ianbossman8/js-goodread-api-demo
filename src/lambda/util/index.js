import OAuth from 'oauth'

export default new OAuth.OAuth(
  'https://www.goodreads.com/oauth/request_token',
  'https://www.goodreads.com/oauth/access_token',
  process.env.API_KEY,
  process.env.API_SECRET,
  '1.0A',
  process.env.NODE_ENV !== 'development'
    ? 'http://localhost:9000/auth-callback'
    : 'https://infallible-wilson-4e1a09.netlify.app/auth-callback',
  'HMAC-SHA1'
)
