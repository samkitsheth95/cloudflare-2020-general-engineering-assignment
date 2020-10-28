const Router = require("./router");

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const data = [
  { name: "Google", url: "https://www.google.com" },
  { name: "Facebook", url: "https://www.facebook.com" },
  { name: "Cloudflare", url: "https://www.cloudflare.com" },
];
const someHost = "https://static-links-page.signalnerve.workers.dev";
const url = someHost;

function getLinksHandler(request) {
  const init = {
    headers: { "content-type": "application/json" },
  };
  return new Response(JSON.stringify(data), init);
}

class ElementHandler {
  element(element) {
    if (element.tagName === "div" && element.getAttribute("id") === "links") {
      let dataToAtag = "";
      for (let link of data) {
        dataToAtag += `<a href="${link.url}">${link.name}</a>`;
      }
      element.setInnerContent(dataToAtag, { html: true });
    }
  }
}

async function getHtmlHandler(request) {
  const init = {
    headers: { "content-type": "text/html;charset=UTF-8" },
  };
  const response = await fetch(url, init);
  const ch = new HTMLRewriter()
    .on("div", new ElementHandler())
    .transform(response);
  const temp = await ch.text();
  return new Response(temp, init);
}

async function handleRequest(request) {
  const r = new Router();
  r.get(".*/links", (request) => getLinksHandler(request));
  r.get("/", (request) => getHtmlHandler(request));
  const resp = await r.route(request);
  return resp;
}
