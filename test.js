const delegate = require("component.delegate");
const com = require("component");
(async()=>{ 
    
    require("./component.request.handler.route.js");
  
    delegate.register( { context: "component.request.handler.deferred", name: "3000/test1" }, () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });

    delegate.register( { context: "component.request.handler.deferred", name: "3000/test2" }, () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });

    const { componentRequest } = await com.require("component.request", { gitUsername: "marchuanv" });

    let results = await componentRequest.send({ 
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

    results = await componentRequest.send({ 
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