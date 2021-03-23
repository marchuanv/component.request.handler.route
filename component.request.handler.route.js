const component = require("component");
component.register({ moduleName: "component.request.handler.route" }).then( async ({ requestHandlerRoute }) => {
    requestHandlerRoute.subscribe({ name: requestHandlerRoute.port }, async (request) => {
        const foundRoute = requestHandlerRoute.routes.find(r => r.path === request.path);
        if (foundRoute) {
            if (!foundRoute.requests){
                foundRoute.requests = [];
            }
            if (!foundRoute.requests.find(id => id === request.id)){
                foundRoute.requests.push(request.id);
                const name = `${requestHandlerRoute.port}${foundRoute.path}`;
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