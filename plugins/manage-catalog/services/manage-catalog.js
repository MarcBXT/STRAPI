"use strict";

const { errorResponse400 } = require("./utils/errors");
const {
  checkStructureAnalysis,
  checkStructureTubes,
  getDataFromSheet,
} = require("./utils/parsing");
const XLSX = require("xlsx");
const fs = require("fs");
const moment = require("moment");
const { sanitizeEntity } = require("strapi-utils");
const {
  HEADINGS_ANALYSIS,
  HEADINGS_TUBES,
  COLUMNS_ANALYSIS,
  COLUMNS_TUBES,
  PATHS,
  TYPE_IMPORT,
} = require("./utils/constants");

/**
 * manage-catalog.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const importAnalysis = async (data, userId) => {
  let logs = {
    nbAnalysis: data.length,
    created: 0,
    updated: 0,
    warnings: [],
  };

  for (const line of data) {
    const logAnalysis = await strapi.services.analysis.createOrUpdate(
      line,
      userId
    );
    if (logAnalysis.created) logs.created++;
    if (logAnalysis.updated) logs.updated++;
    if (logAnalysis.warnings.length > 0)
      logs.warnings.push(logAnalysis.warnings);
  }
  return logs;
};

const importTubes = async (data, userId) => {
  let logs = {
    nbTubes: data.length,
    created: 0,
    updated: 0,
    warnings: [],
  };

  for (const line of data) {
    const logsTubes = await strapi.services.receptacles.createOrUpdate(
      line,
      userId
    );
    if (logsTubes.created) logs.created++;
    if (logsTubes.updated) logs.updated++;
    if (logsTubes.warnings.length > 0) logs.warnings.push(logsTubes.warnings);
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
  const workbook = XLSX.read(fileUploaded.data, { type: "binary" });

  // sheet of analysis
  const analysisJson = getDataFromSheet(workbook, 0, COLUMNS_ANALYSIS);
  // sheet of tubes
  const tubesJson = getDataFromSheet(workbook, 1, COLUMNS_TUBES);

  // check the structure of the data
  const analysisLines = await checkStructureAnalysis(analysisJson);
  console.log("Error in analysis : " + analysisLines.errors.length);
  if (analysisLines.errors.length > 0) {
    await createFileHistory(
      fileUploaded,
      { analysis: analysisLines.errors },
      null,
      ctx.state.user.id,
      "ERROR"
    );
    throw errorResponse400("Error in analysis", analysisLines.errors);
  }

  const tubesLines = await checkStructureTubes(tubesJson);
  console.log("Error in tubes : " + tubesLines.errors.length);
  if (tubesLines.errors.length > 0) {
    await createFileHistory(
      fileUploaded,
      { tubes: tubesLines.errors },
      null,
      ctx.state.user.id,
      "ERROR"
    );
    throw errorResponse400("Error in tubes", tubesLines.errors);
  }

  // save data of analysis, tubes and links
  console.log("Import tubes");
  const logsTubes = await importTubes(tubesLines.data, ctx.state.user.id);
  console.log("Import analyses");
  const logsAnalysis = await importAnalysis(
    analysisLines.data,
    ctx.state.user.id
  );
  const status =
    logsAnalysis.warnings.length > 0 || logsTubes.warnings.length > 0
      ? "WARNING"
      : "OK";
  await createFileHistory(
    fileUploaded,
    null,
    { tubes: logsTubes, analysis: logsAnalysis },
    ctx.state.user.id,
    status
  );
};

const getAllAnalysis = async () => {
  const analysisList = await strapi
    .query("analysis")
    .find({ _sort: "code:asc", _limit: -1 });

  const mapAnalysis = [];
  for (const analysis of analysisList) {
    const r = {
      active: analysis.active ? 1 : 0,
      version: analysis.version,
      id_hsb: analysis.id_hsb,
      code: analysis.code,
      code_sil: analysis.code_sil,
      code_aes: analysis.analysis_aes.map((aes) => aes.code).join(";"),
      code_cns: analysis.prices.map((price) => price.code).join(";"),
      label: analysis.label,
      label_en: analysis.label_en,
      label_de: analysis.label_de,
      synonymous: analysis.synonymous,
      synonymous_en: analysis.synonymous_en,
      synonymous_de: analysis.synonymous_de,
      subcontracted: analysis.subcontracted ? 1 : 0,
      laboratory:
        analysis.laboratory !== null ? analysis.laboratory.code : null,
      urgent: analysis.urgent ? 1 : 0,
      diet: analysis.diet ? 1 : 0,
      comment_diet: analysis.comment_diet,
      comment_diet_en: analysis.comment_diet_en,
      comment_diet_de: analysis.comment_diet_de,
      forbidden_at_home: analysis.forbidden_at_home ? 1 : 0,
      empty_stomach: analysis.empty_stomach ? 1 : 0,
      consent_required: analysis.consent_required ? 1 : 0,
      stability_before_preprocessing: analysis.stability_before_preprocessing,
      time_limit_add_analysis: analysis.time_limit_add_analysis,
      comment_sample: analysis.comment_sample,
      comment_sample_en: analysis.comment_sample_en,
      comment_sample_de: analysis.comment_sample_de,
      comment_preprocessing: analysis.comment_preprocessing,
      comment_preprocessing_en: analysis.comment_preprocessing_en,
      comment_preprocessing_de: analysis.comment_preprocessing_de,
      centrifugation:
        analysis.centrifugation !== null ? analysis.centrifugation.code : null,
      analyser: analysis.analyser !== null ? analysis.analyser.code : null,
      volume_pipette: analysis.volume_pipette,
      time_limit_for_results: analysis.time_limit_for_results,
      monday: analysis.days.map((day) => day.id).includes(1) ? 1 : 0,
      tuesday: analysis.days.map((day) => day.id).includes(2) ? 1 : 0,
      wednesday: analysis.days.map((day) => day.id).includes(3) ? 1 : 0,
      thursday: analysis.days.map((day) => day.id).includes(4) ? 1 : 0,
      friday: analysis.days.map((day) => day.id).includes(5) ? 1 : 0,
      saturday: analysis.days.map((day) => day.id).includes(6) ? 1 : 0,
      sunday: analysis.days.map((day) => day.id).includes(7) ? 1 : 0,
      tubes: analysis.receptacles.map((obj) => obj.code).join(";"),
      permissions: analysis.permissions.map((obj) => obj.username).join(";"),
      documents: analysis.documents.map((obj) => obj.code).join(";"),
    };
    mapAnalysis.push(r);
  }

  return mapAnalysis;
};

const getAllTubes = async () => {
  const tubesList = await strapi
    .query("receptacles")
    .find({ _sort: "code:asc", _limit: -1 });

  const mapTubes = [];
  for (const tube of tubesList) {
    const r = {
      active: tube.active ? 1 : 0,
      version: tube.version,
      code: tube.code,
      code_sil: tube.code_sil,
      label: tube.label,
      public_description: tube.public_description,
      public_description_en: tube.public_description_en,
      public_description_de: tube.public_description_de,
      img: tube.picto !== null ? tube.picto.code : "",
      display_order: tube.display_order,
      timer: tube.timer,
      timer_before_result: tube.timer_before_result,
      regex: tube.regex,
      protected_from_light: tube.protected_from_light ? 1 : 0,
      aliquot: tube.aliquot ? 1 : 0,
    };
    mapTubes.push(r);
  }

  return mapTubes;
};

const exportFile = async (ctx) => {
  let wb = XLSX.utils.book_new();
  const analysis = await getAllAnalysis();
  const tubes = await getAllTubes();

  const wsA = XLSX.utils.json_to_sheet(analysis, {
    origin: "A2",
    skipHeader: true,
  });
  XLSX.utils.sheet_add_aoa(wsA, HEADINGS_ANALYSIS);
  XLSX.utils.book_append_sheet(wb, wsA, "Analyses");

  const wsT = XLSX.utils.json_to_sheet(tubes, {
    origin: "A2",
    skipHeader: true,
  });
  XLSX.utils.sheet_add_aoa(wsT, HEADINGS_TUBES);
  XLSX.utils.book_append_sheet(wb, wsT, "Tubes");

  return XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
};

const synchronize = async (ctx) => {
  const query = ctx.request.query;
  const { user } = ctx.state;

  if (query.date === undefined) {
    throw errorResponse400("Bad request", "date is missing");
  }

  const analysis = await strapi.query("analysis").find(
    {
      updated_at_gt: query.date,
      permissions_in: user.id,
      _sort: "code:asc",
      _limit: -1,
    },
    [
      "id",
      "laboratory",
      "receptacles.id",
      "days",
      "analyser",
      "centrifugation",
      "prices.id",
      "analysis_aes.conditions",
      "documents.id",
      "prelevements.id",
    ]
  );
  const listOfAnalysis = analysis.map((entity) =>
    sanitizeEntity(entity, { model: strapi.models.analysis })
  );

  const tubes = await strapi.query("receptacles").find(
    {
      updated_at_gt: query.date,
      _sort: "code:asc",
      _limit: -1,
    },
    ["id", "aliquots", "primary", "picto.file", "color.code", "color_crown.code"]
  );
  const listOfTubes = tubes.map((entity) =>
    sanitizeEntity(entity, { model: strapi.models.receptacles })
  );

  const documents = await strapi.query("document").find(
    {
      updated_at_gt: query.date,
      _sort: "code:asc",
      _limit: -1,
    },
    ["id", "file_fr", "file_en", "file_de"]
  );
  const listOfDocuments = documents.map((entity) =>
    sanitizeEntity(entity, { model: strapi.models.document })
  );

  const pictos = await strapi.query("image").find(
    {
      updated_at_gt: query.date,
      _sort: "code:asc",
      _limit: -1,
    },
    ["id", "file"]
  );
  const listOfPictos = pictos.map((entity) =>
    sanitizeEntity(entity, { model: strapi.models.image })
  );

  const motivations = await strapi.query("codesaes").find({
    updated_at_gt: query.date,
    _sort: "code:asc",
    _limit: -1,
  });
  const listOfMotivations = motivations.map((entity) =>
    sanitizeEntity(entity, { model: strapi.models.codesaes })
  );

  const prices = await strapi.query("pricing").find(
    {
      updated_at_gt: query.date,
      _sort: "code:asc",
      _limit: -1,
    },
    ["id"]
  );
  const listOfPrices = prices.map((entity) =>
    sanitizeEntity(entity, { model: strapi.models.pricing })
  );

  const samplingActTypes = await strapi.query("actes-de-prelevement").find(
    {
      updated_at_gt: query.date,
      _sort: "code:asc",
      _limit: -1,
    },
    ["id", "act.id", "act_max_age.id", "act_home.id"]
  );
  const listOfSamplingActTypes = samplingActTypes.map((entity) =>
    sanitizeEntity(entity, { model: strapi.models["actes-de-prelevement"] })
  );

  const samplingActs = await strapi.query("prelevement").find(
    {
      updated_at_gt: query.date,
      _sort: "name:asc",
      _limit: -1,
    },
    ["id"]
  );
  const listOfSamplingActs = samplingActs.map((entity) =>
    sanitizeEntity(entity, { model: strapi.models["prelevement"] })
  );

  return {
    receptacles: listOfTubes,
    prices: listOfPrices,
    sampling_act_types: listOfSamplingActTypes,
    sampling_acts: listOfSamplingActs,
    documents: listOfDocuments,
    picto: listOfPictos,
    motivations: listOfMotivations,
    analysis: listOfAnalysis,
  };
};

module.exports = {
  importFile,
  exportFile,
  synchronize,
};
