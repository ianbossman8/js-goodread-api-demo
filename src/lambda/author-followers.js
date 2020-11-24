import parser from 'fast-xml-parser'
import { parse } from 'cookie'
import { api } from '../constant'
import oauth1 from '../util'

const headers = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Headers': 'Accept',
  'Access-Control-Allow-Credentials': 'true',
}

export async function handler(event) {
  try {
    const authObj = parse(event.headers.cookie)
    const tok = authObj.tok
    const tokSecret = authObj.tok_sec

    const { page = 1 } = event.queryStringParameters
    const authorId = event.path.split('/')[2]

    const params = {
      key: process.env.API_KEY,
      page: page,
    }

    const authorFollowersUrl = new URL(`/user/${authorId}/followers.xml`, api.goodread)
    authorFollowersUrl.search = new URLSearchParams(params)

    return new Promise((resolve, reject) => {
      try {
        oauth1.get(authorFollowersUrl.href, tok, tokSecret, function (error, result, response) {
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
        headers,
        body: JSON.stringify(error.message),
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
