const component = require("component");
const { routes } = require("./package.json");
component.register({ componentPackagePath: `${__dirname}/package.json` }).then( async ({ requestHandlerRoute }) => {
    const { config } = await component.load({ moduleName: "component.request.handler" });
    for(const route of routes) {
        route.host = config.requestHandler.hostname;
        route.port = config.requestHandler.port;
    };
    requestHandlerRoute.subscribe({ name: config.requestHandler.port }, async (request) => {
        const foundRoute = routes.find(r => r.port === request.port && r.path === request.path);
        if (foundRoute) {
            if (!foundRoute.requests){
                foundRoute.requests = [];
            }
            if (!foundRoute.requests.find(id => id === request.id)){
                module.exports = foundRoute;
                foundRoute.requests.push(request.id);
                const name = `${foundRoute.port}${foundRoute.path}`;
                requestHandlerRoute.log(`calling callback for route ${foundRoute.path}` );
                return await requestHandlerRoute.publish( { name }, request );
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

