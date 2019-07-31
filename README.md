# kocket-client
Websocket client side framework, like koa.

# Usage
```javascript
const ws = new Kocket(myUrl);
ws.addEventListener('open', () => console.log('opened'));
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
