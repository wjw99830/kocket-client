import { EmptyAsyncFunction, EmptyFunction, noop } from '../util';
import { Context } from './context';


type Middleware = (ctx: Context, n: EmptyAsyncFunction | EmptyFunction) => void;

export class Kocket extends WebSocket {
  private _middlewares: Set<Middleware> = new Set();

  constructor(url: string, protocols?: string | string[]) {
    super(url, protocols);
    this._connect();
  }

  public use(middleware: Middleware) {
    this._middlewares.add(middleware);
    return this;
  }

  public unuse(middleware: Middleware) {
    this._middlewares.delete(middleware);
    return this;
  }

  public send(data: object | string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (isObject(data)) {
      try {
        super.send(JSON.stringify(data));
      } catch {}
    } else {
      super.send(data);
    }
  }

  private _connect() {
    this.addEventListener('message', e => {
      this._applyMiddlewares(e);
    });
  }

  private _applyMiddlewares(e: MessageEvent) {
    const nextFns: EmptyAsyncFunction[] = [];
    const middlewares = Array.from(this._middlewares);
    const l = middlewares.length;
    const ctx = new Context(e);
    for (let i = 0; i < l; i++) {
      const next = async () => {
        const nextMiddleware = middlewares[i + 1] || noop;
        await nextMiddleware(ctx, nextFns[i + 1]);
      };
      nextFns.push(next);
    }
    const head = middlewares[0] || noop;
    head(ctx, nextFns[0] || noop);
  }
}
function isObject(v: any): v is object {
  return Object.prototype.toString.call(v).replace(']', '').split(' ')[1] === 'Object';
}
