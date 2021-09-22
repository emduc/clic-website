const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_PRIV_KEY = process.env.JWT_KEY || crypto.randomBytes(32).toString('hex');

module.exports = (req, res, next) => {
	try{
		if(req.params.configId)
			var conf = jwt.verify(req.params.configId, JWT_PRIV_KEY);
	} catch(ignore) {
		// it was not a valid jwt configId
	}

	if(conf) {
		req.query = Object.assign(req.query, conf.query);
	    req.query.jwtConfigId = req.params.configId;
		req.params.configId = conf.configId;
	}
	next(); 
}
