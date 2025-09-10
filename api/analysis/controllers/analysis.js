'use strict';

const moment = require('moment');

module.exports = {

  findHistory: async (ctx) => {
    const analysis = await strapi.services.analysis.findOne({id: ctx.params.id});
    
    if (analysis === null) {
      ctx.throw(404, 'analysis not found');
    }

    const startDate = ctx.query.startDate;
    const endDate = ctx.query.endDate;
    const version = ctx.query.version;

    const reponse = analysis.histories.filter((a) => {
      if ((startDate === undefined || moment(startDate).isBefore(moment(a.start_date)))
      && (endDate === undefined || moment(endDate).isAfter(moment(a.end_date)))
      && (version === undefined || parseInt(version) === a.version)) {
          return a;
        }
    }).sort((a,b) => a.version - b.version);
   
    ctx.send(reponse);
  } 
};
