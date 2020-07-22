const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = {
    routes: [],
    handle: (options) => {
        let intervalId;
        requestHandler.handle(options);
        module.exports.routes.push({ publicPort: options.publicPort, path: options.path });
        delegate.register(`component.request.handler.route`, options.publicPort, async (request) => {
            const routes = module.exports.routes.filter(r => r.publicPort === options.publicPort && !r.locked);
            if (intervalId){
                clearInterval(intervalId);
            }
            intervalId = setInterval(()=>{
                routes.forEach(r => r.locked = false);
                clearInterval(intervalId);
            },200);
            routes.forEach(r => r.locked = true);
            if (routes.length > 0){
                const foundRoute = routes.find(r => r.path === request.path);
                if (foundRoute){
                    const result = await delegate.call( { context: `component.request.handler.deferred`, name: foundRoute.path }, request);
                    return result;
                } else {
                    const statusMessage = "Not Found";
                    return { 
                        headers: { "Content-Type":"text/plain" },
                        statusCode: 404,
                        statusMessage,
                        data: statusMessage
                    };
                }
            }
        });
    }
};