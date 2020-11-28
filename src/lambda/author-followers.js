import parser from 'fast-xml-parser'
import { parse } from 'cookie'
import { api } from '../constant'
import oauth from './util'

const headers = {
  'Access-Control-Allow-Origin':
    process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'https://infallible-wilson-4e1a09.netlify.app/',
  'Access-Control-Allow-Headers': 'Accept',
  'Access-Control-Allow-Credentials': 'true',
}

export async function handler(event) {
  try {
    const authObj = parse(event.headers.cookie)
    const tok = authObj.tok
    const tokSecret = authObj.tok_sec

    const { page = 1 } = event.queryStringParameters
    const authorPath = event.path.split('/')
    const authorId = authorPath[authorPath.length - 1]

    const params = {
      key: process.env.API_KEY,
      page,
    }

    const authorFollowersUrl = new URL(`/user/${authorId}/followers.xml`, api.goodread)
    authorFollowersUrl.search = new URLSearchParams(params)

    return new Promise((resolve, reject) => {
      try {
        oauth.get(authorFollowersUrl.href, tok, tokSecret, function (error, result, response) {
          if (!error && response.statusCode === 200 && parser.validate(result)) {
            const jsonObj = parser.parse(result)
            resolve({
              headers,
              statusCode: 200,
              body: JSON.stringify(jsonObj),
            })
          }

          reject(new Error('fetch followers error'))
        })
      } catch (error) {
        reject(new Error('parsing error'))
      }
    }).catch((error) => {
      return {
        statusCode: 500,
        body: JSON.stringify(error.message),
        headers,
      }
    })
  } catch (error) {
    return {
      headers,
      statusCode: 500,
      body: JSON.stringify(error.message),
    }
  }
}
