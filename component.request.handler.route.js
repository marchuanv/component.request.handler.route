const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
const routes = [];

module.exports = {
    handle: (options) => {
        requestHandler.handle({ host: options.host, port: options.port });
        routes.push( { host: options.host, port: options.port, path: options.path } );
        const routeName = `${options.port}${options.path}`;
        delegate.register(`component.request.handler.route`, routeName, async (request) => {
            if ((await delegate.callbackCount( { context: `component.request.handler.route` })) === 1) {
                const foundRoute = routes.find(r => r.port === request.port && r.path === request.path);
                if (foundRoute){
                    const name = `${foundRoute.port}${foundRoute.path}`;
                    return await delegate.call( { context: `component.request.handler.deferred`, name }, request );
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