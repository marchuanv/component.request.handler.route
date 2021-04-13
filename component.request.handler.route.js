const component = require("component");
const utils = require("utils");
const { Route } = require("./lib/route.js");
const { RegisteredRoutes } = require("./lib/registeredroutes.js");

component.load(module).then( async ({ requestHandlerRoute }) => {
    const registeredRoutes = new RegisteredRoutes();
    requestHandlerRoute.subscribe(async ({ session, request }) => {
        const { path, hashedPassphrase, hashedPassphraseSalt } = utils.getJSONObject(request.data) || {};
        if (path !== undefined) { //request for a new route
            const newRoute = new Route(path);
            if (hashedPassphrase && hashedPassphraseSalt) {
                newRoute.secure(hashedPassphrase, hashedPassphraseSalt)
            }
            registeredRoutes.push(newRoute);
        }
        const foundRoute = registeredRoutes.find(request.path);
        if (foundRoute) {
            if (!foundRoute.hasRequestId(request.requestId)){
                foundRoute.addRequestId(request.requestId);
                await requestHandlerRoute.log(`calling callback for route ${foundRoute.path}` );
                return await requestHandlerRoute.publish({ session, request, route: foundRoute } );
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