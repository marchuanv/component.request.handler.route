const component = require("component");
const { routes } = require("./package.json");
component.events.register({ componentModule: module, componentParentModuleName: "component.request.handler.deferred" });

component.load({ moduleName: "component.request.handler" }).then( async ({ config }) => {
    for(const route of routes){
        route.host = config.requestHandler.hostname;
        route.port = config.requestHandler.port;
    };
    component.events.requestHandlerRoute.subscribe({ name: config.requestHandler.port }, async (request) => {
        const foundRoute = routes.find(r => r.port === request.port && r.path === request.path);
        if (foundRoute) {
            if (!foundRoute.requests){
                foundRoute.requests = [];
            }
            if (!foundRoute.requests.find(id => id === request.id)){
                foundRoute.requests.push(request.id);
                const name = `${foundRoute.port}${foundRoute.path}`;
                component.logging.write(`calling callback for route ${foundRoute.path}` );
                return await component.events.requestHandlerRoute.publish( { name }, request );
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