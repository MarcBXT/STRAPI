'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

/**
 * manage-catalog.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

 const tubesEquals = (newTube, oldTube) => {
  
  const isEqual = 
        newTube.active === oldTube.active 
        && newTube.code_sil === oldTube.code_sil
        && newTube.label === oldTube.label
        && newTube.public_description === oldTube.public_description && newTube.public_description_en === oldTube.public_description_en && newTube.public_description_de === oldTube.public_description_de 
        && newTube.timer_before_result === oldTube.timer_before_result
        && newTube.timer === oldTube.timer 
        && newTube.display_order === oldTube.display_order
        && newTube.regex === oldTube.regex 
        && (newTube.picto === null && oldTube.picto === null || (newTube.picto !== null && oldTube.picto !== null && newTube.picto === oldTube.picto.id))
        && newTube.protected_from_light === oldTube.protected_from_light
        && newTube.aliquot === oldTube.aliquot;

  return isEqual;
};

module.exports = {
  createOrUpdate: async (tube, userId) => {
    let logs = {
      created: false,
      updated: false,
      warnings: []
    };

    const existingEntry = await strapi.query('receptacles').findOne({code: tube.code});

    let existingPicto = null;
    let missingPicto = null;
    if (tube.id_img !== null) {
      existingPicto = await strapi.query('image').findOne({ code: tube.id_img });
      if (existingPicto === null) {
        missingPicto = tube.id_img;
      }
    }

    if (missingPicto !== null) {
      let missing = {
        code: tube.code
      }
      missing.missingPicto = missingPicto;
      logs.warnings.push(missing);
    }

    const data = {
      active: tube.active,
      version: existingEntry !== null && existingEntry.version !== undefined ? existingEntry.version + 1 : 1,
      code: tube.code,
      code_sil: tube.code_sil,
      label: tube.label,
      public_description: tube.public_description,
      public_description_en: tube.public_description_en,
      public_description_de: tube.public_description_de,
      picto: existingPicto !== null ? existingPicto.id : null,
      display_order: tube.display_order,
      timer: tube.timer,
      timer_before_result: tube.timer_before_result,
      regex: tube.regex,
      protected_from_light: tube.protected_from_light,
      aliquot: tube.aliquot,
      created_by: existingEntry !== null && existingEntry.created_by !== undefined ? existingEntry.created_by : userId,
      updated_by: userId
    };    
    
    if (existingEntry !== null) {  
      const validData = await strapi.entityValidator.validateEntityUpdate(
        strapi.models.receptacles,
        data,
        { isDraft: isDraft(existingEntry, strapi.models.receptacles) }
      );
      
      if (!tubesEquals(data, existingEntry)) {
        console.log("update : " + tube.code);
        await strapi.query("receptacles").update({id: existingEntry.id}, validData);
        logs.updated = true;
      }
    } else {
      const validData = await strapi.entityValidator.validateEntityUpdate(
        strapi.models.receptacles,
        data,
        { isDraft: false }
      );
      console.log("create : " + tube.code);
      await strapi.query('receptacles').create(validData);
      logs.created = true;
    }
    return logs;
  }

};
