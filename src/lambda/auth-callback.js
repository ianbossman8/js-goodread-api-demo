import oauth1 from './util'
import { serialize } from 'cookie'

export async function handler(event) {
  try {
    const { oauth_token, authorize } = event.queryStringParameters

    return new Promise((resolve, reject) => {
      if (authorize !== '1') {
        reject(new Error('not auth'))
      }

      oauth1.getOAuthAccessToken(
        oauth_token,
        process.env.GOODREAD_REQ_TOKEN_SECRET,
        function (err, token, token_secret) {
          if (err) {
            reject(new Error('fail to reach api'))
          }

          const cookieTok = serialize('tok', token, {
            httpOnly: true,
            path: '/',
          })

          const cookieTokSec = serialize('tok_sec', token_secret, {
            httpOnly: true,
            path: '/',
          })

          resolve({
            statusCode: 302,
            headers: {
              Location: 'http://localhost:3000/auth?auth=1',
              'Cache-Control': 'no-cache',
              'Set-Cookie': [cookieTok, cookieTokSec],
            },
            body: '',
          })
        }
      )
    }).catch(() => {
      return {
        statusCode: 302,
        headers: {
          Location: 'http://localhost:3000/auth?auth=0',
          'Cache-Control': 'no-cache',
        },
        body: '',
      }
    })
  } catch (error) {
    return {
      statusCode: 302,
      headers: {
        Location: 'http://localhost:3000/auth?auth=0',
        'Cache-Control': 'no-cache',
      },
      body: '',
    }
  }
}
