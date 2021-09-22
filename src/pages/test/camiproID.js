const fetch = require('node-fetch');

const url = 'https://websrv.epfl.ch/cgi-bin/rwscamipro/getSciper?caller=288467&app=accred&Camipro=';

module.exports = async (req, res, next) => {
	if(req.query.cardid){
		return fetch(url+req.query.cardid, {method:'GET'})
		.then(reply=>reply.json())
		.then(reply=>{
			if(!reply.Sciper){
				return next("Wrong answer from EPFL camipro api");
			}else if(reply.Sciper === ""){
				return next("Pas une camipro ou laissez la camipro jusqu'au long bip");
			}
			req.query.sciper = String(reply.Sciper);
		    next(); 
		}).catch(err=>next(err));
	}
	next();
}
