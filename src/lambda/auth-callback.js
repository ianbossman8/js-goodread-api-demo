import { serialize } from 'cookie'
import oauth from './util'
import db from './util/db'

export async function handler(event) {
  const { client, q } = db
  const reDirLoc = (auth) =>
    process.env.NODE_ENV !== 'production'
      ? `http://localhost:3000/auth?auth=${auth}`
      : `https://infallible-wilson-4e1a09.netlify.app/auth?auth=${auth}`

  try {
    const { oauth_token, authorize } = event.queryStringParameters

    return new Promise((resolve, reject) => {
      if (authorize !== '1') {
        reject(new Error('not auth'))
      }

      return client.query(q.Paginate(q.Match(q.Index('req')))).then((res) => {
        return client.query(q.Get(res.data[0])).then((res) => {
          oauth.getOAuthAccessToken(oauth_token, res.data.token_secret, function (err, token, token_secret) {
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
                Location: reDirLoc(1),
                'Cache-Control': 'no-cache',
              },
              multiValueHeaders: {
                'Set-Cookie': [cookieTok, cookieTokSec],
              },
              body: '',
            })
          })
        })
      })
    }).catch(() => {
      return {
        statusCode: 302,
        headers: {
          Location: reDirLoc(0),
          'Cache-Control': 'no-cache',
        },
        body: '',
      }
    })
  } catch (error) {
    return {
      statusCode: 302,
      headers: {
        Location: reDirLoc(0),
        'Cache-Control': 'no-cache',
      },
      body: '',
    }
  }
}
