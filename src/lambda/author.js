import axios from 'axios'
import parser from 'fast-xml-parser'
import { api } from '../constant'

export async function handler(event) {
  try {
    const authorPath = event.path.split('/')
    const authorId = authorPath[authorPath.length - 1]

    const authorUrl = new URL(`/author/show/${authorId}`, api.goodread)
    const params = {
      key: process.env.API_KEY,
    }

    authorUrl.search = new URLSearchParams(params)

    const result = await axios.get(authorUrl.href)

    if (result.statusText === 'OK' && parser.validate(result.data) === true) {
      const jsonObj = parser.parse(result.data)

      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200,
        body: JSON.stringify(jsonObj),
      }
    }

    throw new Error('fail to reach api')
  } catch (error) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 500,
      body: JSON.stringify(error.message),
    }
  }
}
