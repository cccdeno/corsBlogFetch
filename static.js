import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();

app.use(async (ctx) => {
  console.log('path=', ctx.request.url.pathname)
  await send(ctx, ctx.request.url.pathname, {
    // root: `${Deno.cwd()}/public/`,
    root: Deno.cwd()+'/public/',
    index: "index.html",
  });
});


console.log('start at : http://localhost:8000')
/*
app.use(
  oakCors({
    origin: /^.localhost:(8000|8001)$/,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
)
*/
await app.listen({ port: 8000 });
