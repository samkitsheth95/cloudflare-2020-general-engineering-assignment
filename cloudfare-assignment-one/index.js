const Router = require('./router')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

const data =  { "name": "Link Name", "url": "https://linkurl" }

function getLinksHandler(request) {
  const init = {
      headers: { 'content-type': 'application/json' },
  }
  return new Response(JSON.stringify(data), init)
}

async function handleRequest(request) {
  const r = new Router()
  r.get('.*/links', request => getLinksHandler(request))
  r.get('/', () => new Response('Hello worker!'))
  const resp = await r.route(request)
  return resp
}
