const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = { 
    routes: [],
    handle: (options) => {
        requestHandler.handle(options);
        delegate.register(`component.request.handler.route`, "route", async (request) => {
            if (options.path === request.path && options.privatePort === request.privatePort){
                return await delegate.call( { context: "component.request.handler.deferred"}, request);
            } 
        });
    }
};