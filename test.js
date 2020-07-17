const requestHandlerRoute = require("./component.request.handler.route.js");
const delegate = require("component.delegate");
(async()=>{ 
    const callingModule = "component.request.handler.deferred";
    delegate.register(callingModule, () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: null };
    });
    await requestHandlerRoute.handle(callingModule, {
        publicHost: "localhost",
        publicPort: 3000,
        privateHost: "localhost",
        privatePort: 3000,
        path: "/test"
    });
})().catch((err)=>{
    console.error(err);
});