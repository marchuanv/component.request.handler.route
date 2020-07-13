const requestHandler = require("./component.request.handler.route.js");
const delegate = require("component.delegate");
(async()=>{ 
    const callingModule = "component.request.handler.deferred";
    delegate.register(callingModule, (callback) => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: null };
    });
    await requestHandler.handle(callingModule, { port: 3000, path: "/test/again" });
})().catch((err)=>{
    console.error(err);
});