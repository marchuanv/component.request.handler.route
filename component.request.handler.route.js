const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = { 
    routes: [],
    handle: (callingModule, { port, path }) => {
        const thisModule = `component.request.handler.route.${port}`;
        module.exports.routes.push({ module: callingModule, port, path });
        delegate.register(thisModule, async (request) => {
            let results = { headers: {}, statusCode: -1, statusMessage: "" };
            const route = module.exports.routes.find(r => r.path === request.path && r.port === request.port);
            if (route) {
                return await delegate.call(route.module, request);
            } else {
                const message = "Not Found";
                results.statusCode = 404;
                results.statusMessage = message;
                results.headers = { "Content-Type":"text/plain", "Content-Length": Buffer.byteLength(message) };
                results.data = message;
                return results;
            }
        });
        requestHandler.handle(thisModule, { port });
    }
};