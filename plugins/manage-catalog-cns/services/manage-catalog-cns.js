'use strict';

const { errorResponse400 } = require('./utils/errors');
const {
  checkStructurePrice,
  getDataFromSheet
} = require('./utils/parsing');
const XLSX = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const { sanitizeEntity } = require('strapi-utils');
const { 
  HEADINGS,
  COLUMNS,
  PATHS,
  TYPE_IMPORT
} = require('./utils/constants');

/**
 * manage-catalog-cns.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const importPrices = async (data, userId) => {
  let logs = {
    nbPrices: data.length,
    created: 0,
    updated: 0
  };

  console.log("NB prices : " + data.length);

  for (const line of data) {
    const logPrices = await strapi.services.pricing.createOrUpdate(line, userId);
    if (logPrices.created) logs.created++
    if (logPrices.updated) logs.updated++
  }
  return logs;
};

const createFileHistory = async (fileUploaded, error, logs, userId, status) => {
  
  const date = moment().format("YYYY-MM-DD_HH_mm_ss");  
  const url = `${PATHS.UPLOAD_REP}/${date}_${fileUploaded.name}`;
  const buffer = Buffer.from(fileUploaded.data, 'binary');
  fs.writeFileSync(url, buffer);

  const fileHistory = {
    name_of_file: fileUploaded.name,
    error_content: error,
    log_content: logs,
    status: status,
    created_by: userId,
    updated_by: userId,
    type: TYPE_IMPORT
  };

  const validData = await strapi.entityValidator.validateEntityUpdate(
    strapi.models["import"],
    fileHistory,
    { isDraft: false }
  );  
  const imported = await strapi.query('import').create(validData);

  await strapi.plugins.upload.services.upload.upload({
    data: {
      refId: imported.id,
      ref: 'import',
      field: 'file',
    },
    files: {
      path: url,
      name: fileUploaded.name,
      type: fileUploaded.type, 
      size: buffer.length
    },
  });  
};

const importFile = async (ctx) => {

  const fileUploaded = ctx.request.body;
  const workbook = XLSX.read(fileUploaded.data, { type: "binary" });

  // sheet of prices
  const pricesJson = getDataFromSheet(workbook, 1, COLUMNS);

  // check the structure of the data
  const pricesLines = await checkStructurePrice(pricesJson);
  console.log("Error in analysis : " + pricesLines.errors.length);
  if (pricesLines.errors.length > 0) {
    await createFileHistory(fileUploaded, pricesLines.errors, null, ctx.state.user.id, "ERROR");
    throw errorResponse400('Error in analysis', pricesLines.errors);
  }

  // save data of prices
  console.log("Import prix CNS");
  const logsPrices = await importPrices(pricesLines.data, ctx.state.user.id);
  await createFileHistory(fileUploaded, null, logsPrices, ctx.state.user.id, "OK");
};

const getAllPrices = async () => {
  const list = await strapi.query('pricing').find({ type: 'CNS', _sort: 'code:asc', _limit: -1 });

  const mapPrices = [];
  for (const price of list) { 
    const r = {
      num: "NA",
      label: price.label,
      code: price.code,
      coefficient: price.coefficient,
      price: price.price,
      rule_cumulation: price.rule_cumulation,
      rule_best_practices: price.rule_best_practices,
      comment: price.comment,
      nomenclature_num: "60",
      nomenclature_label: "Laboratoires d'analyses médicales et de biologie clinique",
      part_num: price.part.code,
      part_label: price.part.label,
      chapter_num: price.chapter.code.split(".")[1],
      chapter_label: price.chapter.label,
      section_num: price.section !== null ? price.section.code.split(".")[2] : null,
      section_label: price.section !== null ? price.section.label : null,
      sub_section_num: price.sub_section !== null ? price.sub_section.code.split(".")[3] : null,
      sub_section_label: price.sub_section !== null ? price.sub_section.label: null,
      sub_sub_section_num: price.sub_sub_section !== null ? price.sub_sub_section.code.split(".")[4] : null,
      sub_sub_section_label: price.sub_sub_section !== null ? price.sub_sub_section.label : null
    }
    mapPrices.push(r);
  }
 
  return mapPrices; 
};

const exportFile = async (ctx) => {

  let wb = XLSX.utils.book_new();
  const prices = await getAllPrices();

  const homepage = [ 
    {
      Description: "Nomenclature des actes et services des laboratoires d'analyses médicales et de biologie clinique"
    },
    {
      Description: "Export BioneXt LAB du " + moment().toISOString(),
    }
  ];

  const ws1 = XLSX.utils.json_to_sheet(homepage, { origin: 'A2', skipHeader: false });
  XLSX.utils.book_append_sheet(wb, ws1, "En-tête");

  const ws2 = XLSX.utils.json_to_sheet(prices, { origin: 'A2', skipHeader: true });
  XLSX.utils.sheet_add_aoa(ws2, HEADINGS);
  XLSX.utils.book_append_sheet(wb, ws2, "Nomenclature");
  
  return XLSX.write(wb, {bookType:'xlsx', type:'buffer'});
};

module.exports = {
  importFile,
  exportFile
};
