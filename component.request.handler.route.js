const component = require("component");
const delegate = require("component.delegate");
const routes = [];

module.exports = {
    handle: async (options) => {
        const { componentRequestHandler } = await component.require("component.request.handler", {gitUsername: "marchuanv"});
        const { componentLogging } = await component.require("component.logging", {gitUsername: "marchuanv"});

        await componentRequestHandler.handle({ host: options.host, port: options.port });
        const routeName = `${options.port}${options.path}`;
        const existingRouteIndex = routes.findIndex(r => r.host == options.host && r.port === options.port && r.path === options.path);
        if (existingRouteIndex > -1){
            routes.splice(existingRouteIndex,1);
        }
        routes.push( { host: options.host, port: options.port, path: options.path, requests: [] } );
        delegate.register({ context: "component.request.handler.route", name: routeName }, async (request) => {
            const foundRoute = routes.find(r => r.port === request.port && r.path === request.path);
            if (foundRoute) {
                const isHandled = foundRoute.requests.find(id => id === request.id);
                if (!isHandled){
                    foundRoute.requests.push(request.id);
                    const name = `${foundRoute.port}${foundRoute.path}`;
                    return await delegate.call( { context: `component.request.handler.deferred`, name }, request );
                }
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