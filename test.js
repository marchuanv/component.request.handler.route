const requestHandlerRoute = require("./component.request.handler.route.js");
const delegate = require("component.delegate");
(async()=>{ 
    delegate.register("component.request.handler.deferred", "defer", () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });
    delegate.register("component.request.handler.deferred", "defer", () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });
    delegate.register("component.request.handler.deferred", "defer", () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });
    await requestHandlerRoute.handle({
        publicHost: "localhost",
        publicPort: 3000,
        privateHost: "localhost",
        privatePort: 3000,
        path: "/test"
    });
})().catch((err)=>{
    console.error(err);
});