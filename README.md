# kocket-client
Websocket client side framework, like koa.

# Usage
```javascript
const ws = new Kocket(myUrl);
ws.addEventListener('open', () => console.log('opened'));

// You still can do this, but it's not necessary.
// ws.addEventListener('message', console.log);

ws.use(async (ctx, n) => {
  const json = ctx.getJson();
  if (json !== null) {
    console.log(json);
  } else {
    console.error(`I want to accept a json message!`);
  }
});
```
# Note
Kocket is just a subclass of Websocket. It just provide a middleware pattern.
