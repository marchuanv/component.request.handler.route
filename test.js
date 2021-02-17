const requestHandlerRoute = require("./component.request.handler.route.js");
const request = require("component.request");
const delegate = require("component.delegate");
(async()=>{ 
  
    delegate.register("component.request.handler.deferred", "3000/test1", () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });

    delegate.register("component.request.handler.deferred", "3000/test2", () => {
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

    let results = await request.send({ 
        host: "localhost",
        port: 3000,
        path: "/test1",
        method: "GET",
        headers: {}, 
        data: "",
        retryCount: 1
    });
    if (results.statusCode !== 200){
        throw "routing for test 01 failed";
    }

    results = await request.send({ 
        host: "localhost",
        port: 3000,
        path: "/test2",
        method: "GET",
        headers: {}, 
        data: "",
        retryCount: 1
    });
    if (results.statusCode !== 200){
        throw "routing for test 02 failed";
    }

;
})().catch((err)=>{
    console.error(err);
});