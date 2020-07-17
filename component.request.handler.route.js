const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = { 
    routes: [],
    handle: (callingModule, options) => {
        const thisModule = `component.request.handler.route.${options.privatePort}`;
        module.exports.routes.push({ module: callingModule, privatePort: options.privatePort, path: options.path });
        delegate.register(thisModule, async (request) => {
            const route = module.exports.routes.find(r => r.path === request.path && r.privatePort === request.privatePort);
            if (route) {
                return await delegate.call(route.module, request);
            } else {
                const statusMessage = "Not Found";
                return  { 
                    headers: { 
                        "Content-Type":"text/plain", 
                        "Content-Length": Buffer.byteLength(statusMessage)
                    },
                    statusCode: 404,
                    statusMessage,
                    data: statusMessage
                };
            }
        });
        requestHandler.handle(thisModule, options);
    }
};