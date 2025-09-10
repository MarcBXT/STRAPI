"use strict";

const { notStrictEqual } = require("assert");
const fs = require("fs");
const moment = require("moment");
const { PATHS, TYPE_IMPORT } = require("./utils/constants");
const { errorResponse400 } = require("./utils/errors");
const { checkStructureAnalysis } = require("./utils/parsing");

/**
 * manage-catalog-aes.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const importAes = async (data, userId) => {
  let logs = {
    nbAnalysis: data.length,
    created: 0,
    updated: 0,
    warnings: [],
  };
  console.log("NB analysis AES : " + data.length);
  for (const line of data) {
    const logsAes = await strapi.services.analysisaes.createOrUpdate(
      line,
      userId
    );
    if (logsAes.created) logs.created++;
    if (logsAes.updated) logs.updated++;
    if (logsAes.warnings.length > 0)
      logs.warnings = logs.warnings.concat(logsAes.warnings);
  }
  return logs;
};

const createFileHistory = async (fileUploaded, error, logs, userId, status) => {
  const date = moment().format("YYYY-MM-DD_HH_mm_ss");
  const url = `${PATHS.UPLOAD_REP}/${date}_${fileUploaded.name}`;
  const buffer = Buffer.from(fileUploaded.data, "binary");
  fs.writeFileSync(url, buffer);

  const fileHistory = {
    name_of_file: fileUploaded.name,
    error_content: error,
    log_content: logs,
    status: status,
    created_by: userId,
    updated_by: userId,
    type: TYPE_IMPORT,
  };

  const validData = await strapi.entityValidator.validateEntityUpdate(
    strapi.models["import"],
    fileHistory,
    { isDraft: false }
  );
  const imported = await strapi.query("import").create(validData);

  await strapi.plugins.upload.services.upload.upload({
    data: {
      refId: imported.id,
      ref: "import",
      field: "file",
    },
    files: {
      path: url,
      name: fileUploaded.name,
      type: fileUploaded.type,
      size: buffer.length,
    },
  });
};

const importFile = async (ctx) => {
  const fileUploaded = ctx.request.body;

  const json = JSON.parse(fileUploaded.data);
  const data = json.BioPrescCodes;

  if (data === undefined) {
    await createFileHistory(
      fileUploaded,
      { file: "BioPrescCodes missing" },
      null,
      ctx.state.user.id,
      "ERROR"
    );
    throw errorResponse400("Error in analysis AES", {
      errors: "BioPrescCodes missing",
    });
  }

  const errors = await checkStructureAnalysis(data);
  console.log("Error in analysis AES : " + errors.length);
  if (errors.length > 0) {
    await createFileHistory(
      fileUploaded,
      errors,
      null,
      ctx.state.user.id,
      "ERROR"
    );
    throw errorResponse400("Error in analysis AES", errors);
  }

  // save data of analysis, tubes and links
  console.log("Import AES");
  const logs = await importAes(data, ctx.state.user.id);
  const status = logs.warnings.length > 0 ? "WARNING" : "OK";
  await createFileHistory(fileUploaded, null, logs, ctx.state.user.id, status);
};

const getAllAnalysis = async () => {
  const analysisList = await strapi
    .query("analysisaes")
    .find({ _sort: "code:asc", _limit: -1 });

  const mapAnalysis = [];
  for (const analysis of analysisList) {
    let prices = [];
    for (const price of analysis.prices) {
      const p = {
        Code: price.code,
        Label: price.label,
        Section: price.section,
        SousSection: price.subsection,
      };
      prices.push(p);
    }

    let conditions = [];
    for (const cond of analysis.conditions) {
      const c = {
        Code: cond.code,
        Name: cond.label,
        CodeSystem: cond.code_system,
        AddOriginalText: cond.add_original_text,
      };
      conditions.push(c);
    }

    let target_sites = [];
    for (const site of analysis.target_sites) {
      const s = {
        Code: site.code,
        Name: site.label,
        CodeSystem: site.code_system,
        AddOriginalText: site.add_original_text,
      };
      target_sites.push(s);
    }

    const r = {
      Code: analysis.code,
      Name: analysis.label,
      Specimen: analysis.specimen,
      CNSActs: prices,
      Conditions: conditions,
      TargetSites: target_sites,
    };
    mapAnalysis.push(r);
  }

  return mapAnalysis;
};

const exportFile = async (ctx) => {
  const analysis = await getAllAnalysis();
  const resp = {
    Version: "Export BioneXt LAB " + moment().toISOString(),
    BioPrescCodes: analysis,
  };

  return resp;
};

module.exports = {
  importFile,
  exportFile,
};
