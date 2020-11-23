import axios from 'axios'
import parser from 'fast-xml-parser'
import { api } from '../constant'
import './util'

export async function handler(event) {
  try {
    const authorId = event.path.split('/')[2]

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
          'Access-Control-Allow-Headers': 'Accept',
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
        'Access-Control-Allow-Headers': 'Accept',
      },
      statusCode: 500,
      body: JSON.stringify(error.message),
    }
  }
}
