const requestIds = [];
function Route({ path, isRegisterRoute }) {
    this.path = path;
    this.isRegisterRoute = isRegisterRoute;
    this.issecure = false;
    this.hashedPassphrase = null;
    this.hashedPassphraseSalt = null;
    if (this.isRegisterRoute){
        this.path = "/routes/register";
    }
};

Route.prototype.secure = function(hashedPassphrase, hashedPassphraseSalt) {
    this.hashedPassphrase = hashedPassphrase;
    this.hashedPassphraseSalt = hashedPassphraseSalt;
};

Route.prototype.hasRequestId = function(requestId) {
    return requestIds.find( reqId => reqId === requestId );
};

Route.prototype.addRequestId = function(requestId) {
    requestIds.push(requestId);
};

module.exports = { Route };