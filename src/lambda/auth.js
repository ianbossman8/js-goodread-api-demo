import oauth from './util'
import db from './util/db'
import { api } from '../constant'

export async function handler() {
  try {
    return new Promise((resolve, reject) =>
      oauth.getOAuthRequestToken(function (err, token, token_secret) {
        if (err) {
          reject(new Error('fail to reach api'))
        }

        const item = {
          data: { token_secret },
        }

        return db.client.query(db.q.Paginate(db.q.Match(db.q.Index('req')))).then((res) => {
          if (res.data.length !== 0) {
            db.client.query(db.q.Delete(db.q.Ref(db.q.Collection('goodread'), res.data[0].value.id))).then(() =>
              db.client
                .query(db.q.Create(db.q.Collection('goodread'), item))
                .then(() => {
                  const authUrl = new URL(`/oauth/authorize?oauth_token=${token}`, api.goodread)

                  resolve({
                    statusCode: 302,
                    headers: {
                      Location: authUrl,
                      'Cache-Control': 'no-cache',
                    },
                    body: '',
                  })
                })
                .catch((err) => {
                  return {
                    statusCode: 302,
                    headers: {
                      Location:
                        process.env.NODE_ENV === 'production'
                          ? 'http://localhost:3000/auth?auth=0'
                          : 'https://infallible-wilson-4e1a09.netlify.app/auth?auth=0',
                      'Cache-Control': 'no-cache',
                    },
                    body: JSON.stringify(err.message),
                  }
                })
            )
          } else {
            db.client
              .query(db.q.Create(db.q.Collection('goodread'), item))
              .then(() => {
                const authUrl = new URL(`/oauth/authorize?oauth_token=${token}`, api.goodread)

                resolve({
                  statusCode: 302,
                  headers: {
                    Location: authUrl,
                    'Cache-Control': 'no-cache',
                  },
                  body: '',
                })
              })
              .catch((err) => {
                return {
                  statusCode: 302,
                  headers: {
                    Location:
                      process.env.NODE_ENV === 'production'
                        ? 'http://localhost:3000/auth?auth=0'
                        : 'https://infallible-wilson-4e1a09.netlify.app/auth?auth=0',
                    'Cache-Control': 'no-cache',
                  },
                  body: JSON.stringify(err.message),
                }
              })
          }
        })
      })
    ).catch((error) => {
      return {
        statusCode: 302,
        headers: {
          Location:
            process.env.NODE_ENV === 'production'
              ? 'http://localhost:3000/auth?auth=0'
              : 'https://infallible-wilson-4e1a09.netlify.app/auth?auth=0',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(error.message),
      }
    })
  } catch (error) {
    return {
      statusCode: 302,
      headers: {
        Location:
          process.env.NODE_ENV === 'production'
            ? 'http://localhost:3000/auth?auth=0'
            : 'https://infallible-wilson-4e1a09.netlify.app/auth?auth=0',
        'Cache-Control': 'no-cache',
      },
      body: '',
    }
  }
}
