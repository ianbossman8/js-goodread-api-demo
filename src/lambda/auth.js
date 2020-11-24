import { api } from '../constant'

export async function handler() {
  try {
    console.log(process.env.GOODREAD_REQ_TOKEN)
    const authUrl = new URL(`/oauth/authorize?oauth_token=${process.env.GOODREAD_REQ_TOKEN}`, api.goodread)

    return {
      statusCode: 302,
      headers: {
        Location: authUrl,
        'Cache-Control': 'no-cache',
      },
      body: '',
    }
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
