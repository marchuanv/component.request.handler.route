const componentRequestHandler = require("component.request.handler");
const logging = require("logging");
logging.config.add("Request Handler Route");
module.exports = { 
    sessions: [],
    handle: (options) => {
        return new Promise(async (resovle) => {
            const requeue = async () => {
                (await componentRequestHandler.port(options)).handle(async(request) => {
                    let results = { headers: {}, statusCode: -1, statusMessage: "" };
                    if (request.path === options.path) {
                        const resultsPromise = new Promise((resultsResolve, resultsReject) => {
                            resovle({ receive: async (callback) => {
                                let results = callback(request);
                                if (results && results.then){
                                    results = await results.catch((error)=>{
                                        logging.write("Request Handler Route"," ", error.toString());
                                        resultsReject(error);
                                    });
                                }
                                if (results){
                                    resultsResolve(results)
                                } else {
                                    logging.write("Request Handler Route",`callback did not return any data`);
                                    return resultsReject("callback did not return any data.");
                                }
                            }});
                        });
                        results = await resultsPromise;
                    } else {
                        requeue();
                        const message = "Not Found";
                        results.statusCode = 404;
                        results.statusMessage = message;
                        results.headers = { "Content-Type":"text/plain", "Content-Length": Buffer.byteLength(message) };
                        results.data = message;
                    }
                    return results;
                });
            };
            requeue();
        });
    }
};