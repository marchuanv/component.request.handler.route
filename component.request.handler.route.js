const component = require("component");
const delegate = require("component.delegate");
const { routes } = require("./package.json");

component.require("component.request.handler", { gitUsername: "marchuanv" }).then(({ hostname, port }) => {
    for(const route of routes){
        route.host = hostname;
        route.port = port;
    };
    component.require("component.logging", {gitUsername: "marchuanv"}).then(({ componentLogging }) => {
        delegate.register({ context: "component.request.handler.route", name: port }, async (request) => {
            const foundRoute = routes.find(r => r.port === request.port && r.path === request.path);
            if (foundRoute) {
                if (!foundRoute.requests){
                    foundRoute.requests = [];
                }
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
    });
});
module.exports = {};