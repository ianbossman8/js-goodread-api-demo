import oauth from './util'
import db from './util/db'
import { api } from '../constant'

export async function handler() {
  const { client, q } = db
  const reDirLoc = (auth) =>
    process.env.NODE_ENV !== 'production'
      ? `http://localhost:3000/auth?auth=${auth}`
      : `https://infallible-wilson-4e1a09.netlify.app/auth?auth=${auth}`

  try {
    return new Promise((resolve, reject) =>
      oauth.getOAuthRequestToken(function (err, token, token_secret) {
        if (err) {
          reject(new Error('fail to reach api'))
        }

        return client.query(q.Paginate(q.Match(q.Index('req')))).then((res) => {
          console.log(2378489278293479)
          if (res.data.length !== 0) {
            client.query(q.Delete(q.Ref(q.Collection('goodread'), res.data[0].value.id))).then(() =>
              client
                .query(
                  q.Create(q.Collection('goodread'), {
                    data: { token_secret },
                  })
                )
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
                      Location: reDirLoc(0),
                      'Cache-Control': 'no-cache',
                    },
                    body: JSON.stringify(err.message),
                  }
                })
            )
          } else {
            client
              .query(q.Create(q.Collection('goodread'), item))
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
                    Location: reDirLoc(0),
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
          Location: reDirLoc(0),
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(error.message),
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
