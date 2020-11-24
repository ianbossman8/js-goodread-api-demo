import axios from 'axios'
import parser from 'fast-xml-parser'
import { api } from '../constant'

export async function handler(event) {
  try {
    const { q, page = 1, search = 'all' } = event.queryStringParameters
    const searchUrl = new URL('/search/index.xml', api.goodread)

    const params = {
      key: process.env.API_KEY,
      q,
      page,
      'search[field]': search,
    }

    searchUrl.search = new URLSearchParams(params)

    const result = await axios.get(searchUrl.href)

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
