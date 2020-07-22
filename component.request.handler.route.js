const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = { 
    handle: (options) => {
        requestHandler.handle(options);
        delegate.register(`component.request.handler.route`, "route", async (request) => {
            if (options.publicPort === request.publicPort){
                if (options.path === request.path){
                    return await delegate.call( { context: `component.request.handler.deferred.${request.path}` }, request);
                } else {
                    const statusMessage = "Not Found";
                    return { 
                        headers: { "Content-Type":"text/plain" },
                        statusCode: 404,
                        statusMessage,
                        data: statusMessage
                    };
                }
            } 
        });
    }
};