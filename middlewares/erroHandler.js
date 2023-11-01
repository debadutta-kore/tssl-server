const { AxiosError } = require("axios");

module.exports = function (err, req, res, next) {
    if (err) {
        if (err instanceof AxiosError) {
            if (err.response) {
                // The request was made and the server responded with a non-2xx status code
                res.status(err.response.status).send(err.response.data)
            } else if (err.request) {
                // The request was made but no response was received
                res.status(400).send({ message: err.message })
            } else {
                // Something happened in setting up the request that triggered an error
                res.status(500).send({ message: err.message });
            }
        } else {
            res.status(500).send({ message: err.message || 'Internal Server Error' });
        }
    } else {
        next();
    }
}