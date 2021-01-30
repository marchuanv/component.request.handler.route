const requestHandler = require("component.request.handler");
const delegate = require("component.delegate");
const logging = require("logging");
logging.config.add("Request Handler Route");
const routes = [];

module.exports = {
    handle: (options) => {
        requestHandler.handle({ host: options.host, port: options.port });
        const route = { host: options.host, port: options.port, path: options.path };
        routes.push(route);
        delegate.register(`component.request.handler.route`, route.port, async (request) => {
            const _filteredRoutes = routes.filter(r => r.port === route.port && !r.locked);
            _filteredRoutes.forEach(r => r.locked = true);
            if ( _filteredRoutes.length > 0 ){
                const foundRoute = _filteredRoutes.find(r => r.path === request.path);
                if (foundRoute){
                    const name = `${foundRoute.port}${foundRoute.path}`;
                    const result = await delegate.call( { context: `component.request.handler.deferred`, name }, request );
                    setTimeout(()=>{
                        _filteredRoutes.forEach(r => r.locked = false);
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