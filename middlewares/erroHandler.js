const { AxiosError } = require("axios");

module.exports = function(err,_,res,next){
    if(err) {
        if(typeof err === 'object') {
            if(err instanceof AxiosError) {
                if (err.response) {
                    // The request was made and the server responded with a non-2xx status code
                    res.status(err.response.status).send(err.response.data)
                  } else if (err.request) {
                    // The request was made but no response was received
                    res.status(500).send({message: 'No response'})
                  } else {
                    // Something happened in setting up the request that triggered an error
                    res.status(500).send({message: err.message});
                  }
            } else {
                res.status(err.status || 500).send({message: err.message});
            }
        } else {
            res.status(500).send({message: err});
        }
    } else {
        next();
    }
}