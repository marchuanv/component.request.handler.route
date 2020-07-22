const requestHandlerRoute = require("./component.request.handler.route.js");
const delegate = require("component.delegate");
(async()=>{ 
    delegate.register("component.request.handler.deferred", "defer", (request) => {
    });
    delegate.register("component.request.handler.deferred", "defer", (request) => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: JSON.stringify(request)};
    });
    delegate.register("component.request.handler.deferred", "defer", (request) => {
    });
    await requestHandlerRoute.handle({
        publicHost: "localhost",
        publicPort: 3000,
        privateHost: "localhost",
        privatePort: 3000,
        path: "/test"
    });
    await requestHandlerRoute.handle({
        publicHost: "localhost",
        publicPort: 4000,
        privateHost: "localhost",
        privatePort: 4000,
        path: "/test"
    });
    await requestHandlerRoute.handle({
        publicHost: "localhost",
        publicPort: 5000,
        privateHost: "localhost",
        privatePort: 5000,
        path: "/test"
    });
})().catch((err)=>{
    console.error(err);
});