'use strict';

const XLSX = require('xlsx');

const getDataFromSheet = (workbook, rank, header) => {
  const sheet = workbook.SheetNames[rank];
  const ws = workbook.Sheets[sheet];
  return XLSX.utils.sheet_to_json(ws, { header: header, range: 1, raw: true });
}

const parseString = (data, nbCar) => {
  if (data !== null && data !== undefined && typeof data === 'string' && data.toString().trim() !== '') {
    if (nbCar !== undefined) {
      return data.toString().trim().substring(0, nbCar);
    } else {
        return data.toString().trim();    
    }    
  } else if (data === null || data === undefined || data.toString().trim() === '') {
    return null;
  } else {
    return undefined;
  }
};

const parseBoolean = (data) => {
  if (data !== null && data !== undefined && typeof data === 'number') {
    return data === 1;
  } else {
    return undefined;
  }
};

const parseNumber = (data) => {
  if (data !== null && data !== undefined && typeof data === 'number') {
    return data;
  } else if (data === null || data === undefined) {
    return null;
  } else {
    return undefined;
  }
};

const parseLineAnalysis = (line) => {
  return {
    code: parseString(line["code"], 20),
    code_sil: parseString(line["code_sil"], 20),
    active: parseBoolean(line["active"]),    
    id_hsb: parseNumber(line["id_hsb"]),
    code_aes: parseString(line["code_aes"]), 
    code_cns: parseString(line["code_cns"]),
    label: parseString(line["label"]),
    label_en: parseString(line["label_en"]),
    label_de: parseString(line["label_de"]),
    synonymous: parseString(line["synonymous"]),
    synonymous_en: parseString(line["synonymous_en"]),
    synonymous_de: parseString(line["synonymous_de"]),
    subcontracted: parseBoolean(line["subcontracted"]),
    laboratory: parseString(line["laboratory"]),
    urgent: parseBoolean(line["urgent"]),
    diet: parseBoolean(line["diet"]),
    comment_diet: parseString(line["comment_diet"]),
    comment_diet_en: parseString(line["comment_diet_en"]),
    comment_diet_de: parseString(line["comment_diet_de"]),
    forbidden_at_home: parseBoolean(line["forbidden_at_home"]),
    empty_stomach: parseBoolean(line["empty_stomach"]),
    consent_required: parseBoolean(line["consent_required"]),
    stability_before_preprocessing: parseNumber(line["stability_before_preprocessing"]),
    time_limit_add_analysis: parseNumber(line["time_limit_add_analysis"]),  
    comment_sample: parseString(line["comment_sample"]),
    comment_sample_en: parseString(line["comment_sample_en"]),
    comment_sample_de: parseString(line["comment_sample_de"]),
    comment_preprocessing: parseString(line["comment_preprocessing"]),
    comment_preprocessing_en: parseString(line["comment_preprocessing_en"]),
    comment_preprocessing_de: parseString(line["comment_preprocessing_de"]),
    centrifugation: parseString(line["centrifugation"]),
    analyser: parseString(line["analyser"]),
    volume_pipette: parseNumber(line["volume_pipette"]),
    time_limit_for_results: parseNumber(line["time_limit_for_results"]),
    monday: parseBoolean(line["monday"]),
    tuesday: parseBoolean(line["tuesday"]),
    wednesday: parseBoolean(line["wednesday"]),
    thursday: parseBoolean(line["thursday"]),
    friday: parseBoolean(line["friday"]),
    saturday: parseBoolean(line["saturday"]),
    sunday: parseBoolean(line["sunday"]),
    tubes: parseString(line["tubes"]),
    permissions: parseString(line["permissions"]),
    documents: parseString(line["documents"])
  };
};

const parseLineTubes = (line) => {
  return {
    code: parseString(line["code"], 20),
    code_sil: parseString(line["code_sil"], 20),
    active: parseBoolean(line["active"]),
    label: parseString(line["label"]),
    public_description: parseString(line["public_description"]),
    public_description_en: parseString(line["public_description_en"]),
    public_description_de: parseString(line["public_description_de"]),
    id_img: parseString(line["id_img"]),
    display_order: parseNumber(line["display_order"]),
    timer: parseNumber(line["timer"]),
    timer_before_result: parseNumber(line["timer_before_result"]),
    regex: parseString(line["regex"]),
    protected_from_light: parseBoolean(line["protected_from_light"]),
    aliquot: parseBoolean(line["aliquot"])
  };
};

const checkErrorsAnalysis = (line, i) => {
  if (line.active === undefined 
    || line.code === undefined || line.code === null || line.code_sil === undefined
    || line.id_hsb === undefined || line.code_aes === undefined || line.code_cns === undefined 
    || line.label === undefined || line.label === null || line.label_en === undefined || line.label_de === undefined 
    || line.synonymous === undefined || line.synonymous_en === undefined || line.synonymous_de === undefined 
    || line.subcontracted === undefined || line.laboratory === undefined || line.urgent === undefined
    || line.diet === undefined || line.comment_diet === undefined || line.comment_diet_en === undefined || line.comment_diet_de === undefined
    || line.forbidden_at_home === undefined || line.empty_stomach === undefined
    || line.consent_required === undefined || line.stability_before_preprocessing === undefined || line.time_limit_add_analysis === undefined
    || line.comment_sample === undefined || line.comment_sample_en === undefined || line.comment_sample_de === undefined
    || line.comment_preprocessing === undefined || line.comment_preprocessing_en === undefined || line.comment_preprocessing_de === undefined
    || line.centrifugation === undefined
    || line.analyser === undefined || line.volume_pipette === undefined || line.time_limit_for_results === undefined || line.monday === undefined
    || line.tuesday === undefined || line.wednesday === undefined || line.thursday === undefined || line.friday === undefined 
    || line.saturday === undefined || line.sunday === undefined 
    || line.tubes === undefined || line.permissions === undefined || line.documents === undefined) {
    
    const errors = {
      line: i,
      active: line.active === undefined ? "Format invalide (0 ou 1)" : "OK",
      code: line.code === undefined ? "Format invalide" : (line.code === null ? "Obligatoire" : "OK"),
      code_sil: line.code_sil === undefined ? "Format invalide" : "OK",
      id_hsb: line.id_hsb === undefined ? "Format invalide (entier)" : "OK",
      code_aes: line.code_aes === undefined ? "Format invalide" : "OK",
      code_cns: line.code_cns === undefined ? "Format invalide" : "OK",
      label: line.label === undefined ? "Format invalide" : (line.label === null ? "Obligatoire" : "OK"),
      label_en: line.label_en === undefined ? "Format invalide" : "OK",
      label_de: line.label_de === undefined ? "Format invalide" : "OK",
      synonymous: line.synonymous === undefined ? "Format invalide" : "OK",
      synonymous_en: line.synonymous_en === undefined ? "Format invalide" : "OK",
      synonymous_de: line.synonymous_de === undefined ? "Format invalide" : "OK",
      subcontracted: line.subcontracted === undefined ? "Format invalide  (0 ou 1)" : "OK",
      laboratory: line.laboratory === undefined ? "Format invalide" : "OK",
      urgent: line.urgent === undefined ? "Format invalide (0 ou 1)" : "OK",
      diet: line.diet === undefined ? "Format invalide (0 ou 1)" : "OK",
      comment_diet: line.comment_diet === undefined ? "Format invalide" : "OK",
      comment_diet_en: line.comment_diet_en === undefined ? "Format invalide" : "OK",
      comment_diet_de: line.comment_diet_de === undefined ? "Format invalide" : "OK",
      forbidden_at_home: line.forbidden_at_home === undefined ? "Format invalide (0 ou 1)" : "OK",
      empty_stomach: line.empty_stomach === undefined ? "Format invalide (0 ou 1)" : "OK",
      consent_required: line.consent_required === undefined ? "Format invalide (0 ou 1)" : "OK",
      stability_before_preprocessing: line.stability_before_preprocessing === undefined ? "Format invalide (nombre)" : "OK",
      time_limit_add_analysis: line.time_limit_add_analysis === undefined ? "Format invalide (nombre)" : "OK",
      comment_sample: line.comment_sample === undefined ? "Format invalide" : "OK",
      comment_sample_en: line.comment_sample_en === undefined ? "Format invalide" : "OK",
      comment_sample_de: line.comment_sample_de === undefined ? "Format invalide" : "OK",
      comment_preprocessing: line.comment_preprocessing === undefined ? "Format invalide" : "OK",
      comment_preprocessing_en: line.comment_preprocessing_en === undefined ? "Format invalide" : "OK",
      comment_preprocessing_de: line.comment_preprocessing_de === undefined ? "Format invalide" : "OK",
      centrifugation: line.centrifugation === undefined ? "Format invalide" : "OK",
      analyser: line.analyser === undefined ? "Format invalide" : "OK",
      volume_pipette: line.volume_pipette === undefined ? "Format invalide (nombre)" : "OK",
      time_limit_for_results: line.time_limit_for_results === undefined ? "Format invalide (nombre)" : "OK",
      monday: line.monday === undefined ? "Format invalide (0 ou 1)" : "OK",
      tuesday: line.tuesday === undefined ? "Format invalide (0 ou 1)" : "OK",
      wednesday: line.wednesday === undefined ? "Format invalide (0 ou 1)" : "OK",
      thursday: line.thursday === undefined ? "Format invalide (0 ou 1)" : "OK",
      friday: line.friday === undefined ? "Format invalide (0 ou 1)" : "OK",
      saturday: line.saturday === undefined ? "Format invalide (0 ou 1)" : "OK",
      sunday: line.sunday === undefined ? "Format invalide (0 ou 1)" : "OK",
      tubes: line.tubes === undefined ?  "Format invalide" : "OK",
      permissions: line.permissions === undefined ? "Format invalide" : "OK",
      documents: line.documents === undefined ? "Format invalide" : "OK"
    };
    return errors;
  } else {
    return null;
  }
};

const checkErrorsTubes = (line, i) => {
  if (line.active === undefined 
    || line.code === undefined || line.code_sil === undefined 
    || line.code === null || line.code_sil === null
    || line.label === undefined || line.label === null    
    || line.public_description === undefined || line.public_description_en === undefined || line.public_description_de === undefined
    || line.id_img === undefined || line.display_order === undefined 
    || line.timer === undefined || line.timer_before_result === undefined || line.regex === undefined
    || line.protected_from_light === undefined || line.aliquot === undefined) {
    
    const errors = {
      line: i,
      active: line.active === undefined ? "Format invalide (0 ou 1)" : "OK",
      code: line.code === undefined ? "Format invalide" : (line.code === null ? "Obligatoire" : "OK"),
      code_sil: line.code_sil === undefined ? "Format invalide" : (line.code_sil === null ? "Obligatoire" : "OK"),
      label: line.label === undefined ? "Format invalide" : (line.label === null ? "Obligatoire" : "OK"),      
      public_description: line.public_description === undefined ? "Format invalide" : "OK",
      public_description_en: line.public_description_en === undefined ? "Format invalide" :  "OK",
      public_description_de: line.public_description_de === undefined ? "Format invalide" :  "OK",
      id_img: line.id_img === undefined ? "Format invalide" : "OK",
      display_order: line.display_order === undefined ? "Format invalide (entier)" : "OK",
      timer: line.timer === undefined ? "Format invalide (nombre)" : "OK",
      timer_before_result: line.timer_before_result === undefined ? "Format invalide (nombre)" : "OK",
      regex: line.regex === undefined ? "Format invalide" : "OK",
      protected_from_light: line.protected_from_light === undefined ? "Format invalide (0 ou 1)" : "OK",
      aliquot: line.aliquot === undefined ? "Format invalide (0 ou 1)" : "OK"
    };
    return errors;
  } else {
    return null;
  }
};

const checkStructureTubes = async (json) => {

  const data = [];
  const errors = [];
  let i=2;

  // check structure of data of tubes
  for (const line of json) {
    const parsed = parseLineTubes(line);
    const error = checkErrorsTubes(parsed, i);
    
    if (error !== null) {
      errors.push(error);
    }

    i++;
    data.push(parsed);
  }

  return {data, errors};
};

const checkStructureAnalysis = async (json) => {

  const data = [];
  const errors = [];
  let i=2;
  
  // check structure of data of analysis
  for (const line of json) {
    const parsed = parseLineAnalysis(line);
    const error = checkErrorsAnalysis(parsed, i);
    
    if (error !== null) {
      errors.push(error);
    }

    i++;
    data.push(parsed);
  }

  return {data, errors};
};

module.exports = {
  checkStructureAnalysis,
  checkStructureTubes,
  getDataFromSheet
};
