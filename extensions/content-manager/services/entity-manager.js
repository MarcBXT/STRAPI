'use strict';

const { omit } = require('lodash/fp');
const strapiUtils = require('strapi-utils');

const { PUBLISHED_AT_ATTRIBUTE } = strapiUtils.contentTypes.constants;

const omitPublishedAtField = omit(PUBLISHED_AT_ATTRIBUTE);

module.exports = {
  
  update: async (entity, body, model) => {

    const params = { id: entity.id };
    
    if (model === 'application::analysis.analysis') {     
      const h = await strapi.services.analysis.createHistory(entity);
      body.histories.push(h.id);
      body.version = body.version +1;
    } else if (model === 'application::receptacles.receptacles') { 
      body.version = body.version +1;
    } else if (model === 'application::analysisaes.analysisaes') {
      const h = await strapi.services.analysisaes.createHistory(entity);
      body.histories.push(h.id);
      body.version = body.version +1;
    } else if (model === 'application::pricing.pricing') {
      const h = await strapi.services.pricing.createHistory(entity);
      body.histories.push(h.id);
      body.version = body.version +1;
    }
    
    const publishData = omitPublishedAtField(body);
    return strapi.entityService.update({ params, data: publishData }, { model });
  }
};
