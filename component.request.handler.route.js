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
            routes.forEach(r => r.locked = true);
            if (routes.length > 0){
                const foundRoute = routes.find(r => r.path === request.path);
                if (foundRoute){
                    const name = `${foundRoute.publicPort}${foundRoute.path}`;
                    const result = await delegate.call( { context: `component.request.handler.deferred`, name }, request);
                    setTimeout(()=>{
                        routes.forEach(r => r.locked = false);
                    },200);
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