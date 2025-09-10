'use strict';

const XLSX = require('xlsx');

const getDataFromSheet = (workbook, rank, header) => {
  const sheet = workbook.SheetNames[rank];
  const ws = workbook.Sheets[sheet];
  return XLSX.utils.sheet_to_json(ws, { header: header, range: 1, raw: true });
}

const parseString = (data, nbCar) => {
  if (data !== null && data !== undefined && typeof data === 'string') {
    if (nbCar !== undefined) {
      return data.toString().trim().substring(0, nbCar);
    } else {
      return data.toString().trim();
    }    
  } else if (data === null || data === undefined || data === '') {
    return null;
  } else {
    return undefined;
  }
};

const parseNumber = (data) => {
  if (data !== null && data !== undefined && typeof data === 'number') {
    return data;
  } else if (data === null || data === undefined || data === '') {
    return null;
  } else {
    return undefined;
  }
};

const parseLinePrice = (line) => {

  return {
    code: parseString(line["code"], 20),
    label: parseString(line["label"]),
    price: parseNumber(line["price"]),    
    coefficient: parseNumber(line["coefficient"]),
    rule_cumulation: parseString(line["rule_cumulation"]),
    rule_best_practices: parseString(line["rule_best_practices"]),
    comment: parseString(line["comment"]),
    nomenclature_num: parseString(line["nomenclature_num"]),
    nomenclature_label: parseString(line["nomenclature_label"]),
    part_num: parseNumber(line["part_num"]),
    part_label: parseString(line["part_label"]),
    chapter_num: parseNumber(line["chapter_num"]),
    chapter_label: parseString(line["chapter_label"]),
    section_num: parseNumber(line["section_num"]),
    section_label: parseString(line["section_label"]),
    sub_section_num: parseNumber(line["sub_section_num"]),
    sub_section_label: parseString(line["sub_section_label"]),
    sub_sub_section_num: parseNumber(line["sub_sub_section_num"]),
    sub_sub_section_label: parseString(line["sub_sub_section_label"])
  };
};

const checkErrorsPrice = (line, i) => {
  if (line.code === undefined || line.label === undefined
    || line.coefficient === undefined || line.price === undefined
    || line.rule_cumulation === undefined || line.rule_best_practices === undefined
    || line.part_num === undefined || line.chapter_num === undefined
    || line.section_num === undefined || line.sub_section_num === undefined || line.sub_sub_section_num === undefined) {
    
    const errors = {
      line: i,  
      code: line.code === undefined ? "Format invalide" : "OK",
      label: line.label === undefined ? "Format invalide" : "OK",
      price: line.price === undefined ? "Format invalide" : "OK",
      coefficient: line.coefficient === undefined ? "Format invalide" : "OK",
      rule_cumulation: line.rule_cumulation === undefined ? "Format invalide" : "OK",
      rule_best_practices: line.rule_best_practices === undefined ? "Format invalide" : "OK",
      comment: line.comment === undefined ? "Format invalide" : "OK",
      part_num: line.part_num === undefined ? "Format invalide" : "OK",
      part_label: line.part_label === undefined ? "Format invalide" : "OK",
      chapter_num: line.chapter_num === undefined ? "Format invalide" : "OK",
      chapter_label: line.chapter_label === undefined ? "Format invalide" : "OK",
      section_num: line.section_num === undefined ? "Format invalide" : "OK",
      section_label: line.section_label === undefined ? "Format invalide" : "OK",
      sub_section_num: line.sub_section_num === undefined ? "Format invalide" : "OK",
      sub_section_label: line.sub_section_label === undefined ? "Format invalide" : "OK",
      sub_sub_section_num: line.sub_sub_section_num === undefined ? "Format invalide" : "OK",
      sub_sub_section_label: line.sub_sub_section_label === undefined ? "Format invalide" : "OK",
    };
    return errors;
  } else {
    return null;
  }
};

const buildLinePrice = (line) => {

  let build = line;
  build.chapter_num = line.chapter_num !== null ? line.part_num.toString() + "." + line.chapter_num.toString() : null;
  build.section_num = line.section_num !== null ? build.chapter_num + "." + line.section_num.toString() : null;
  build.sub_section_num = line.sub_section_num !== null ? build.section_num + "." + line.sub_section_num.toString() : null;
  build.sub_sub_section_num = line.sub_sub_section_num !== null ? build.sub_section_num + "." + line.sub_sub_section_num.toString() : null;
  build.type = 'CNS'
  return build;
};

const checkStructurePrice = async (json) => {

  const data = [];
  const errors = [];
  let i=2;
  
  // check structure of data of analysis
  for (const line of json) {
    const parsed = parseLinePrice(line);
    const error = checkErrorsPrice(parsed, i);
    const build = buildLinePrice(parsed);
    
    if (error !== null) {
      errors.push(error);
    }

    i++;
    data.push(build);
  }

  return {data, errors};
};

module.exports = {
  checkStructurePrice,
  getDataFromSheet
};
