const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

module.exports = async (req, res, next) => {
	if(req.query.ACUri && !req.allow){
		req.shouldAccessControl = true;
		var url = new URL(decodeURI(req.query.ACUri));
		url.search = new URLSearchParams(req.query).toString();

		return fetch(url,{method:'POST', body:req.rawEPFLResult})
		.then(reply=>reply.json())
		.then(reply=>{
			req.allow = true;
			next();
		})
		.catch(err=>next(err));
	}
	next();
}
