const component = require("component");
component.load(module).then( async ({ requestHandlerRoute }) => {
    const { channel, routes } = requestHandlerRoute.config;
    requestHandlerRoute.subscribe({ channel }, async ({ requestId, path }) => {
        const foundRoute = routes.find(r => r.path === path);
        if (foundRoute) {
            if (!foundRoute.requests){
                foundRoute.requests = [];
            }
            if (!foundRoute.requests.find(id => id === requestId)){
                foundRoute.requests.push(requestId);
                await requestHandlerRoute.log(`calling callback for route ${foundRoute.path}` );
                const results = {};
                Object.assign(results,foundRoute);
                Object.assign(results,request);
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