import OAuth from 'oauth'

function getOAuthReqCode() {
  const oauth1 = new OAuth.OAuth(
    'https://www.goodreads.com/oauth/request_token',
    'https://www.goodreads.com/oauth/access_token',
    process.env.API_KEY,
    process.env.API_SECRET,
    '1.0A',
    'http://localhost:9000/auth-callback',
    'HMAC-SHA1'
  )

  if (
    typeof process.env.GOODREAD_REQ_TOKEN === 'undefined' &&
    typeof process.env.GOODREAD_REQ_TOKEN_SECRET === 'undefined'
  ) {
    oauth1.getOAuthRequestToken(function (err, token, token_secret) {
      if (!err) {
        process.env.GOODREAD_REQ_TOKEN = token
        process.env.GOODREAD_REQ_TOKEN_SECRET = token_secret
      }
    })
  }

  return oauth1
}

export default getOAuthReqCode()
