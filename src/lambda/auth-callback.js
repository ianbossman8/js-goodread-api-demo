import { serialize } from 'cookie'
import oauth from './util'
import db from './util/db'

export async function handler(event) {
  try {
    const { oauth_token, authorize } = event.queryStringParameters

    return new Promise((resolve, reject) => {
      if (authorize !== '1') {
        reject(new Error('not auth'))
      }
      return db.client.query(db.q.Paginate(db.q.Match(db.q.Index('req')))).then((res) => {
        return db.client.query(db.q.Get(res.data[0])).then((res) => {
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
                Location:
                  process.env.NODE_ENV !== 'production'
                    ? 'http://localhost:3000/auth?auth=1'
                    : 'https://infallible-wilson-4e1a09.netlify.app/auth?auth=1',
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
          Location:
            process.env.NODE_ENV !== 'production'
              ? 'http://localhost:3000/auth?auth=0'
              : 'https://infallible-wilson-4e1a09.netlify.app/auth?auth=0',
          'Cache-Control': 'no-cache',
        },
        body: '',
      }
    })
  } catch (error) {
    return {
      statusCode: 302,
      headers: {
        Location:
          process.env.NODE_ENV !== 'production'
            ? 'http://localhost:3000/auth?auth=0'
            : 'https://infallible-wilson-4e1a09.netlify.app/auth?auth=0',
        'Cache-Control': 'no-cache',
      },
      body: '',
    }
  }
}
