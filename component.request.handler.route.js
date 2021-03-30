const component = require("component");
component.register(module).then( async ({ requestHandlerRoute }) => {
    const { channel, routes } = requestHandlerRoute;
    requestHandlerRoute.subscribe({ channel }, async ({ requestId, path }) => {
        const foundRoute = routes.find(r => r.path === path);
        if (foundRoute) {
            if (!foundRoute.requests){
                foundRoute.requests = [];
            }
            if (!foundRoute.requests.find(id => id === requestId)){
                foundRoute.requests.push(requestId);
                await requestHandlerRoute.log(`calling callback for route ${foundRoute.path}` );
                return await requestHandlerRoute.publish( { channel }, request );
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