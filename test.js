const componentRequestHandlerRoute = require("./component.request.handler.route.js");
(async()=>{
    const requeue = async () => {
        (await componentRequestHandlerRoute.handle({ port: 3000, path: "/test" })).receive((request) => {
            requeue();
            return {
                statusCode: 200,
                statusMessage: "Success",
                headers: {"Content-Type":"text/html"},
                contentType: "text/html",
                data: "<html>HELLO</html>"
            };
        });
    };
    requeue();
})().catch((err)=>{
    console.log(err);
});
