const fetch = require('node-fetch');

const url = 'https://websrv.epfl.ch/rwspersons/getPerson?app=accred&id=';

const Person = require('../models/person');

module.exports = async (req, res, next) => {
	if(req.query.sciper && req.query.sciper.match(/^[0-9]{6}$/) && !req.skipSciper)
	{
        fetch(url+req.query.sciper,{method:"GET"})
        .then(reply=>reply.json())
        .then(reply=>reply.result)
        .then(async reply=>{
        	if (!reply || !reply.display) {
		        next("Wrong Sciper or Wrong answer from EPFL user api (people maybe uneligible to sciper CS)");
		    } else { 
		      if (!reply.email) {
  			  	person = await Person.findOne({sciper: req.query.sciper});
  			  	if (person && person.phone == undefined) {
  			  	  return next("No EPFL mail ! You need to add your phone on "+req.protocol+'://'+req.host+"/phone.html as replacement !");
  			  	} else {
  			  		req.query.email = reply.display+"@noepflmail";
  			  	}
		      } else {
			    req.query.email = reply.email;
		      }

		      req.query.name = reply.display;	
		      
		      if (reply.accreds) {
		      	req.query.section = [];
		      	for ([key, acc] of reply.accreds.entries()) {
		      		disp = acc.accred.display.match(/(.*)\./)
		      		if(disp[1] != undefined){
		      			req.query.section.push(disp[1]);
		      		}
		      	}
		      }

		      if (reply.status) {
		      	req.query.status = reply.status;
		      }

		      req.rawEPFLResult = reply;

		      next();    
		    }
        })
        .catch(err=>next(err));
	} else {
        next();
    }
}
