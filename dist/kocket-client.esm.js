/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const noop = () => { };

class Context {
    constructor(event) {
        this.event = event;
    }
    getRawData() {
        return this.event.data;
    }
    getJson() {
        try {
            const json = JSON.parse(this.event.data);
            return json;
        }
        catch (e) {
            return null;
        }
    }
    getBlob(options) {
        return new Blob([this.event.data], options);
    }
    getDataURL() {
        return new Promise(resolve => {
            const fr = new FileReader();
            fr.addEventListener('loadend', () => {
                resolve(fr.result);
            });
            fr.readAsDataURL(this.getBlob());
        });
    }
}

class Kocket extends WebSocket {
    constructor(url, protocols) {
        super(url, protocols);
        this._middlewares = new Set();
        this._connect();
    }
    use(middleware) {
        this._middlewares.add(middleware);
        return this;
    }
    unuse(middleware) {
        this._middlewares.delete(middleware);
        return this;
    }
    send(data) {
        if (isObject(data)) {
            try {
                super.send(JSON.stringify(data));
            }
            catch (_a) { }
        }
        else {
            super.send(data);
        }
    }
    _connect() {
        this.addEventListener('message', e => {
            this._applyMiddlewares(e);
        });
    }
    _applyMiddlewares(e) {
        const nextFns = [];
        const middlewares = Array.from(this._middlewares);
        const l = middlewares.length;
        const ctx = new Context(e);
        for (let i = 0; i < l; i++) {
            const next = () => __awaiter(this, void 0, void 0, function* () {
                const nextMiddleware = middlewares[i + 1] || noop;
                yield nextMiddleware(ctx, nextFns[i + 1]);
            });
            nextFns.push(next);
        }
        const head = middlewares[0] || noop;
        head(ctx, nextFns[0] || noop);
    }
}
function isObject(v) {
    return Object.prototype.toString.call(v).replace(']', '').split(' ')[1] === 'Object';
}

export default Kocket;
