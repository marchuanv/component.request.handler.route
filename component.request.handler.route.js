const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = {
    // routes: [],
    handle: (options) => {
        requestHandler.handle(options);
        // module.exports.routes.push({ publicPort: options.publicPort, path: options.path });
        delegate.register(`component.request.handler.route.${options.publicPort}`, "route", async (request) => {
            // const foundRoute = module.exports.routes.find(r => r.publicPort === request.publicPort && r.path === request.path);
            if (options.path === request.path){
                return await delegate.call( { context: `component.request.handler.deferred.${foundRoute.path}` }, request);
            } else {
                const statusMessage = "Not Found";
                return { 
                    headers: { "Content-Type":"text/plain" },
                    statusCode: 404,
                    statusMessage,
                    data: statusMessage
                };
            }
        });
    }
};