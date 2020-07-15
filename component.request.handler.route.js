const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = { 
    handle: (callingModule, { port, path }) => {
        const thisModule = `component.request.handler.route.${path.replace(/\//g,"")}.${port}`;
        delegate.register(thisModule, async (request) => {
            let results = { headers: {}, statusCode: -1, statusMessage: "" };
            if (request.path === path && request.port === port) {
                return await delegate.call(callingModule, request);
            } else {
                const message = "Not Found";
                results.statusCode = 404;
                results.statusMessage = message;
                results.headers = { "Content-Type":"text/plain", "Content-Length": Buffer.byteLength(message) };
                results.data = message;
            }
            return results;
        });
        requestHandler.handle(thisModule, { port });
    }
};