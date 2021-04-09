const component = require("component");
component.load(module).then( async ({ requestHandlerRoute }) => {
    const { channel, routes } = requestHandlerRoute.config;
    requestHandlerRoute.subscribe({ channel }, async ({ headers, session, data, path, requestId }) => {
        const foundRoute = routes.find(r => r.path === path);
        if (foundRoute) {
            if (!foundRoute.requests){
                foundRoute.requests = [];
            }
            if (!foundRoute.requests.find(id => id === requestId)){
                foundRoute.requests.push(requestId);
                await requestHandlerRoute.log(`calling callback for route ${foundRoute.path}` );
                const results = { session, headers, data, route: foundRoute };
                return await requestHandlerRoute.publish( { channel }, results );
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