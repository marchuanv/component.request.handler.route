const component = require("component");
const utils = require("utils");
const { Route } = require("./lib/route.js");
const { RegisteredRoutes } = require("./lib/registeredroutes.js");

component.load(module).then( async ({ requestHandlerRoute }) => {
    const registeredRoutes = new RegisteredRoutes();
    registeredRoutes.register(new Route({ isRegisterRoute: true }));
    requestHandlerRoute.receiveDependantComponentNotifications(async ({ session, request }) => {
        const foundRoute = registeredRoutes.find(request.path);
        if (foundRoute) {
            if (foundRoute.isRegisterRoute) {
                const { path, hashedPassphrase, hashedPassphraseSalt } = utils.getJSONObject(request.data) || {};
                if (path) { //request for a new route
                    const newRoute = new Route({ path });
                    if (hashedPassphrase && hashedPassphraseSalt) {
                        newRoute.secure(hashedPassphrase, hashedPassphraseSalt);
                    }
                    registeredRoutes.register(newRoute);
                    const statusMessage = `${path} registered`;
                    return { 
                        success: true,
                        headers: { "Content-Type":"text/plain" },
                        statusCode: 200,
                        statusMessage,
                        data: statusMessage
                    };
                } else {
                    const statusMessage = `failed to register route, no URL path was specified.`;
                    return { 
                        success: false,
                        headers: { "Content-Type":"text/plain" },
                        statusCode: 500,
                        statusMessage,
                        data: statusMessage
                    };
                }
            } else {
                if (!foundRoute.hasRequestId(request.requestId)){
                    foundRoute.addRequestId(request.requestId);
                    await requestHandlerRoute.log(`calling callback for route ${foundRoute.path}` );
                    return await requestHandlerRoute.notifyDependantComponents({ session, request, route: foundRoute } );
                }
            }
        } else {
            const statusMessage = "Not Found";
            return { 
                success: false,
                headers: { "Content-Type":"text/plain" },
                statusCode: 404,
                statusMessage,
                data: statusMessage
            };
        }
    });
});