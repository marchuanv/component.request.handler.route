const requestHandlerRoute = require("./component.request.handler.route.js");
const delegate = require("component.delegate");
(async()=>{ 
  
    delegate.register("component.request.handler.deferred", "3000/test1", () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });
  
    await requestHandlerRoute.handle({
        host: "localhost",
        port: 3000,
        path: "/test1"
    });
    await requestHandlerRoute.handle({
        host: "localhost",
        port: 3000,
        path: "/test2"
    });
;
})().catch((err)=>{
    console.error(err);
});