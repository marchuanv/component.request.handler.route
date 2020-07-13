const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = { 
    routes: [],
    handle: (callingModule, { port, path }) => {
        module.exports.routes.push({ module: callingModule, path });
        const currentModule = `component.request.handler.route`;
        delegate.register(currentModule, async (request) => {
            let results = { headers: {}, statusCode: -1, statusMessage: "" };
            const routeModule = module.exports.routes.find(route => route.path === request.path);
            if (routeModule) {
                return await delegate.call(routeModule.module, request);
            } else {
                const message = "Not Found";
                results.statusCode = 404;
                results.statusMessage = message;
                results.headers = { "Content-Type":"text/plain", "Content-Length": Buffer.byteLength(message) };
                results.data = message;
            }
            return results;
        });
        requestHandler.handle(currentModule, { port });
    }
};