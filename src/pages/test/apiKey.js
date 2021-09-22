const keys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

const verifyKey = (givenKey) => (givenKey && keys.includes(givenKey));

module.exports = (req, res, next) => {
    if(!verifyKey(req.query.apiKey) && !verifyKey(req.header('X-Api-Key'))) {
        res.status(401);
    	return next("Provide a correct API key (?apiKey= or X-Api-Key)");
    }
    next();
}
