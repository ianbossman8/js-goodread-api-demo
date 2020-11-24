import faunadb from 'faunadb'

export default (function () {
  const q = faunadb.query
  const client = new faunadb.Client({
    secret: process.env.DB_SECRET,
  })

  return {
    q,
    client,
  }
})()
