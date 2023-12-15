import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application()

const posts = [
  {id: 0, title: 'aaa', body: 'aaaaa'}, 
  {id: 1, title: 'bbb', body: 'bbbbb'}
]

const router = new Router()

router.get('/', (ctx)=>ctx.response.redirect('/public/index.html'))
  .get('/list', list)
  .get('/post/:id', show)
  .post('/post', create)
  .get('/public/(.*)', pub)



async function pub(ctx) {
  console.log('path=', ctx.request.url.pathname)
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/`,
    index: "index.html",
  })
}

async function list (ctx) {
  // ctx.response.headers.set("Access-Control-Allow-Origin", "http://localhost:8000")
  // ctx.response.headers.set("access-control-allow-origin", "http://localhost:8000")
  ctx.response.type = 'application/json'
  ctx.response.body = posts
}

async function show (ctx) {
  const id = ctx.params.id
  const post = posts[id]
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.response.type = 'application/json'
  ctx.response.body = post
}

async function create (ctx) {
  // var post = ctx.request.body
  const body = ctx.request.body(); // content type automatically detected
  console.log('body = ', body)
  if (body.type === "json") {
    let post = await body.value
    post.id = posts.length
    posts.push(post)
    ctx.response.body = 'success'
    console.log('create:save=>', post)
  }
}

app.use(
  oakCors({
    origin: 'http://172.104.100.202:8000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
)
// app.use(oakCors()); // Enable CORS for All Routes
console.info("CORS-enabled web server listening on port 8000");
app.use(router.routes())
app.use(router.allowedMethods())

console.log('Server run at http://localhost:8001')
await app.listen({ port: 8001 })
