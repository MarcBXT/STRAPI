'use strict';
const moment = require('moment');

const { isDraft } = require('strapi-utils').contentTypes;


/**
 * manage-catalog.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const arrayEquals = (a, b) => {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
};

const analysisEquals = (newAn, oldAn) => {
  
  const isEqual =
          newAn.active === oldAn.active 
          && (newAn.analyser === null && oldAn.analyser === null || (newAn.analyser !== null && oldAn.analyser !== null && newAn.analyser === oldAn.analyser.id))
          && newAn.code_sil === oldAn.code_sil 
          && newAn.code_aes === oldAn.code_aes
          && newAn.code_cns === oldAn.code_cns
          && newAn.comment_diet === oldAn.comment_diet && newAn.comment_diet_en === oldAn.comment_diet_en && newAn.comment_diet_de === oldAn.comment_diet_de 
          && newAn.comment_preprocessing === oldAn.comment_preprocessing && newAn.comment_preprocessing_en === oldAn.comment_preprocessing_en && newAn.comment_preprocessing_de === oldAn.comment_preprocessing_de 
          && newAn.comment_sample === oldAn.comment_sample && newAn.comment_sample_en === oldAn.comment_sample_en && newAn.comment_sample_de === oldAn.comment_sample_de
          && newAn.consent_required === oldAn.consent_required 
          && newAn.diet === oldAn.diet 
          && newAn.id_hsb === oldAn.id_hsb 
          && newAn.empty_stomach === oldAn.empty_stomach
          && newAn.label === oldAn.label && newAn.label_en === oldAn.label_en && newAn.label_de === oldAn.label_de
          && (newAn.laboratory === null && oldAn.laboratory === null || (newAn.laboratory !== null && oldAn.laboratory !== null && newAn.laboratory === oldAn.laboratory.id))
          && newAn.synonymous === oldAn.synonymous && newAn.synonymous_en === oldAn.synonymous_en && newAn.synonymous_de === oldAn.synonymous_de
          && newAn.stability_before_preprocessing === oldAn.stability_before_preprocessing
          && newAn.subcontracted === oldAn.subcontracted 
          && newAn.time_limit_add_analysis === oldAn.time_limit_add_analysis 
          && newAn.time_limit_for_results === oldAn.time_limit_for_results
          && newAn.urgent === oldAn.urgent 
          && newAn.volume_pipette === oldAn.volume_pipette
          && (newAn.centrifugation === null && oldAn.centrifugation === null || (newAn.centrifugation !== null && oldAn.centrifugation !== null && newAn.centrifugation === oldAn.centrifugation.id))
          && arrayEquals(newAn.days.sort((a, b) => a - b), oldAn.days.map((day) => day.id).sort((a, b) => a - b))
          && arrayEquals(newAn.receptacles.sort((a, b) => a - b), oldAn.receptacles.map((tube) => tube.id).sort((a, b) => a - b))
          && arrayEquals(newAn.prices.sort((a, b) => a - b), oldAn.prices.map((price) => price.id).sort((a, b) => a - b))
          && arrayEquals(newAn.analysis_aes.sort((a, b) => a - b), oldAn.analysis_aes.map((an) => an.id).sort((a, b) => a - b))
          && arrayEquals(newAn.permissions.sort((a, b) => a - b), oldAn.permissions.map((perm) => perm.id).sort((a, b) => a - b))
          && arrayEquals(newAn.documents.sort((a, b) => a - b), oldAn.documents.map((doc) => doc.id).sort((a, b) => a - b));

  return isEqual; 
};

const createHistory = async (existingEntry) => {
  const history = {
    active: existingEntry.active,
    version: existingEntry.version,
    id_hsb: existingEntry.id_hsb,
    code: existingEntry.code,
    code_sil: existingEntry.code_sil,        
    code_aes: existingEntry.code_aes,
    code_cns: existingEntry.code_cns,        
    label: existingEntry.label,
    label_en: existingEntry.label_en,
    label_de: existingEntry.label_de,
    synonymous: existingEntry.synonymous,
    synonymous_en: existingEntry.synonymous_en,
    synonymous_de: existingEntry.synonymous_de,
    subcontracted: existingEntry.subcontracted,
    laboratory: existingEntry.laboratory,
    urgent: existingEntry.urgent,
    diet: existingEntry.diet,
    comment_diet: existingEntry.comment_diet,
    comment_diet_en: existingEntry.comment_diet_en,
    comment_diet_de: existingEntry.comment_diet_de,
    forbidden_at_home: existingEntry.forbidden_at_home,
    empty_stomach: existingEntry.empty_stomach,
    consent_required: existingEntry.consent_required,
    stability_before_preprocessing: existingEntry.stability_before_preprocessing,
    time_limit_add_analysis: existingEntry.time_limit_add_analysis,  
    comment_sample: existingEntry.comment_sample,
    comment_sample_en: existingEntry.comment_sample_en,
    comment_sample_de: existingEntry.comment_sample_de,
    comment_preprocessing: existingEntry.comment_preprocessing,
    comment_preprocessing_en: existingEntry.comment_preprocessing_en,
    comment_preprocessing_de: existingEntry.comment_preprocessing_de,
    centrifugation: existingEntry.centrifugation,
    analyser: existingEntry.analyser,
    volume_pipette: existingEntry.volume_pipette,
    time_limit_for_results: existingEntry.time_limit_for_results,
    days: existingEntry.days,
    receptacles: existingEntry.receptacles,
    prices: existingEntry.prices,
    analysis_aes: existingEntry.analysis_aes,
    permissions: existingEntry.permissions,
    documents: existingEntry.documents,
    created_by: existingEntry.created_by,
    updated_by: existingEntry.updated_by,
    start_date: existingEntry.updated_at,
    end_date: moment().toISOString()
  };

  const validDataH = await strapi.entityValidator.validateEntityUpdate(
    strapi.models.analysisH,
    history,
    { isDraft: false }
  );  

  return await strapi.query("analysis-h").create(validDataH);
};

const createOrUpdate = async (analysisLine, userId) => {
  let logs = {
    created: false,
    updated: false,
    warnings: []
  };
  
  const existingEntry = await strapi.query('analysis').findOne({code: analysisLine.code});
  
  let existingLabo = null;
  let missingLabo = null;
  if (analysisLine.laboratory !== null) {
    existingLabo = await strapi.query('laboratory').findOne({ code: analysisLine.laboratory });
    if (existingLabo === null) {
      missingLabo = analysisLine.laboratory;
    }
  }
  
  let existingPrg = null;
  let missingProgram = null;
  if (analysisLine.centrifugation !== null) {
    existingPrg = await strapi.query('programme').findOne({ code: analysisLine.centrifugation });
    if (existingPrg === null) {
      missingProgram = analysisLine.centrifugation;
    }
  }

  let existingAnalyser = null;
  let missingAnalyser = null;
  if (analysisLine.analyser !== null) {
    existingAnalyser = await strapi.query('analyser').findOne({ code: analysisLine.analyser });
    if (existingAnalyser === null) {
      missingAnalyser = analysisLine.analyser;
    }
  }

  const days = [];
  if (analysisLine.monday) days.push(1);
  if (analysisLine.tuesday) days.push(2);
  if (analysisLine.wednesday) days.push(3);
  if (analysisLine.thursday) days.push(4);
  if (analysisLine.friday) days.push(5);
  if (analysisLine.saturday) days.push(6);
  if (analysisLine.sunday) days.push(7);
  
  const tubes = [];
  let missingTubes = [];
  if (analysisLine.tubes !== null && analysisLine.tubes !== undefined) {
    const tubesTmp = analysisLine.tubes.split(";");
    for (const tube of tubesTmp) {
      const existingTube = await strapi.query('receptacles').findOne({ code: tube });
      if (existingTube !== null) {
        tubes.push(existingTube.id);
      } else {
        missingTubes.push(tube);
      }
    }
  }

  const prices = [];
  let missingPrices = [];
  if (analysisLine.code_cns !== null && analysisLine.code_cns !== undefined) {
    const list = analysisLine.code_cns.split(";");
    for (const elt of list) {
      const existing = await strapi.query('pricing').findOne({ code: elt });
      if (existing !== null) {
        prices.push(existing.id);
      } else {
        missingPrices.push(elt);
      }
    }
  }

  const analysis_aes = [];
  let missingAnalysisAES = [];
  if (analysisLine.code_aes !== null && analysisLine.code_aes !== undefined) {
    const list = analysisLine.code_aes.split(";");
    for (const elt of list) {
      const existing = await strapi.query('analysisaes').findOne({ code: elt });
      if (existing !== null) {
        analysis_aes.push(existing.id);
      } else {
        missingAnalysisAES.push(elt);
      }
    }
  }

  const permissions = [];
  let missingPermissions = [];
  if (analysisLine.permissions !== null && analysisLine.permissions !== undefined) {
    const permissionsTmp = analysisLine.permissions.split(";");
    for (const permission of permissionsTmp) {
      const existingPerm = await strapi.query('user', 'users-permissions').findOne({ username:  permission});
      if (existingPerm !== null) {
        permissions.push(existingPerm.id);
      } else {
        missingPermissions.push(permission);
      }
    }
  }

  const documents = [];
  let missingDocuments = [];
  if (analysisLine.documents !== null && analysisLine.documents !== undefined) {
    const list = analysisLine.documents.split(";");
    for (const elt of list) {
      const existing = await strapi.query('document').findOne({ code: elt });
      if (existing !== null) {
        documents.push(existing.id);
      } else {
        missingDocuments.push(elt);
      }
    }
  }

  if (missingPrices.length > 0 || missingTubes.length > 0 || missingAnalysisAES.length > 0 
    || missingPermissions.length > 0 || missingDocuments.length > 0
    || missingAnalyser !== null || missingLabo !== null || missingProgram !== null) {
    let missing = {
      code: analysisLine.code
    }
    if (missingTubes.length > 0) missing.missingTubes = missingTubes;
    if (missingPrices.length > 0) missing.missingPrices = missingPrices;
    if (missingAnalysisAES.length > 0) missing.missingAnalysisAES = missingAnalysisAES;
    if (missingAnalyser !== null) missing.missingAnalyser = missingAnalyser;
    if (missingLabo !== null) missing.missingLabo = missingLabo;
    if (missingProgram !== null) missing.missingProgram = missingProgram;
    if (missingPermissions.length > 0) missing.missingPermissions = missingPermissions;
    if (missingDocuments.length > 0) missing.missingDocuments = missingDocuments;
    logs.warnings.push(missing);
  }

  const data = {
    active: analysisLine.active,
    version: existingEntry !== null && existingEntry.version !== undefined ? existingEntry.version + 1 : 1,
    id_hsb: analysisLine.id_hsb,
    code: analysisLine.code,
    code_sil: analysisLine.code_sil,        
    code_aes: analysisLine.code_aes,
    code_cns: analysisLine.code_cns,        
    label: analysisLine.label,
    label_en: analysisLine.label_en,
    label_de: analysisLine.label_de,
    synonymous: analysisLine.synonymous,
    synonymous_en: analysisLine.synonymous_en,
    synonymous_de: analysisLine.synonymous_de,
    subcontracted: analysisLine.subcontracted,
    laboratory: existingLabo !== null ? existingLabo.id : null,
    urgent: analysisLine.urgent,
    diet: analysisLine.diet,
    comment_diet: analysisLine.comment_diet,
    comment_diet_en: analysisLine.comment_diet_en,
    comment_diet_de: analysisLine.comment_diet_de,
    forbidden_at_home: analysisLine.forbidden_at_home,
    empty_stomach: analysisLine.empty_stomach,
    consent_required: analysisLine.consent_required,
    stability_before_preprocessing: analysisLine.stability_before_preprocessing,
    time_limit_add_analysis: analysisLine.time_limit_add_analysis,  
    comment_sample: analysisLine.comment_sample,
    comment_sample_en: analysisLine.comment_sample_en,
    comment_sample_de: analysisLine.comment_sample_de,
    comment_preprocessing: analysisLine.comment_preprocessing,
    comment_preprocessing_en: analysisLine.comment_preprocessing_en,
    comment_preprocessing_de: analysisLine.comment_preprocessing_de,
    centrifugation: existingPrg !== null ? existingPrg.id : null,
    analyser: existingAnalyser !== null ? existingAnalyser.id : null,
    volume_pipette: analysisLine.volume_pipette,
    time_limit_for_results: analysisLine.time_limit_for_results,
    days: days,
    receptacles: tubes,
    prices: prices,
    analysis_aes: analysis_aes,
    permissions: permissions,
    documents: documents,
    created_by: existingEntry !== null && existingEntry.created_by !== undefined ? existingEntry.created_by : userId,
    updated_by: userId,
    histories: existingEntry !== null && existingEntry.histories !== undefined ? existingEntry.histories : []
  };
  
  if (existingEntry !== null) {
    if (!analysisEquals(data, existingEntry)) {
      
      console.log("update : " + analysisLine.code);
      
      const h = await createHistory(existingEntry);

      data.histories.push(h.id);

      const validData = await strapi.entityValidator.validateEntityUpdate(
        strapi.models.analysis,
        data,
        { isDraft: isDraft(existingEntry, strapi.models.analysis) }
      );

      await strapi.query("analysis").update({id: existingEntry.id}, validData);
      logs.updated = true;
    }
  } else {
    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.analysis,
      data,
      { isDraft: false }
    );
    console.log("create : " + analysisLine.code);
    await strapi.query('analysis').create(validData);
    logs.created = true;
  }
  
  return logs;
}

module.exports = {
  createOrUpdate,
  createHistory,  
};
