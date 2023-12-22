
module.exports = {
    setSessionTimeout(timeout) {
        global.sessionTimeout = timeout;
    },
    getSessionTimeout() {
        return global.sessionTimeout;
    },
    init() {
        global.sessionTimeout = Number(process.env.sessionTimeout || "1800000");
    }
}