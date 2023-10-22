module.exports = function (req, res, next) {
     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', req.get('origin') || "*");

     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'Accept,Content-type');
 
     // Set to true if you need the website to include cookies in the requests sent
     res.setHeader('Access-Control-Allow-Credentials', true);

     //Set to not let browser send preflight request prior to each api request (in second)
     res.setHeader('Access-Control-Max-Age', 7200);

     next();
};
