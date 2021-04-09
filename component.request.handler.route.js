const component = require("component");
component.load(module).then( async ({ requestHandlerRoute }) => {
    const { channel } = requestHandlerRoute.config;
    requestHandlerRoute.subscribe({ channel }, async ({ session, request }) => {
        for(const route of requestHandlerRoute.config.routes) {
            route.host = request.host;
            route.port = request.port;
            if (route.secure) {
                route.hashedPassphrase = requestHandlerRoute.config.hashedPassphrase;
                route.hashedPassphraseSalt = requestHandlerRoute.config.hashedPassphraseSalt;
            }
        };
        const foundRoute = requestHandlerRoute.config.routes.find(r => r.path === request.path);
        if (foundRoute) {
            if (!foundRoute.requests){
                foundRoute.requests = [];
            }
            if (!foundRoute.requests.find(id => id === request.requestId)){
                foundRoute.requests.push(request.requestId);
                await requestHandlerRoute.log(`calling callback for route ${foundRoute.path}` );
                return await requestHandlerRoute.publish( { channel }, { session, request, route: foundRoute } );
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