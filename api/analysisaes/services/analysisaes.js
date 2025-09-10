"use strict";

const moment = require("moment");

const TYPE_CODE = {
  CONDITION: "CONDITION",
  TARGET_SITE: "TARGET_SITE",
};

const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

const analysisEquals = (newAn, oldAn) => {
  const isEqual =
    newAn.expired === oldAn.expired &&
    newAn.specimen === oldAn.specimen &&
    newAn.label === oldAn.label &&
    newAn.start_date === oldAn.start_date &&
    arrayEquals(
      newAn.prices.sort((a, b) => a - b),
      oldAn.prices.map((act) => act.id).sort((a, b) => a - b)
    ) &&
    arrayEquals(
      newAn.conditions.sort((a, b) => a - b),
      oldAn.conditions.map((cond) => cond.id).sort((a, b) => a - b)
    ) &&
    arrayEquals(
      newAn.target_sites.sort((a, b) => a - b),
      oldAn.target_sites.map((site) => site.id).sort((a, b) => a - b)
    );

  return isEqual;
};

const createHistory = async (existingEntry) => {
  const history = {
    expired: existingEntry.expired,
    version: existingEntry.version,
    code: existingEntry.code,
    label: existingEntry.label,
    specimen: existingEntry.specimen,
    application_start_date: existingEntry.application_start_date,
    prices: existingEntry.prices,
    conditions: existingEntry.conditions,
    target_sites: existingEntry.target_sites,
    created_by: existingEntry.created_by,
    updated_by: existingEntry.updated_by,
    start_date: existingEntry.updated_at,
    end_date: moment().toISOString(),
  };

  return await strapi.query("analysisaes-h").create(history);
};

const createOrUpdate = async (analysisLine, userId) => {
  let logs = {
    created: false,
    updated: false,
    warnings: [],
  };

  const existingEntry = await strapi
    .query("analysisaes")
    .findOne({ code: analysisLine.Code });

  let prices = [];
  let missing = [];
  if (analysisLine.CNSActs !== undefined) {
    for (const act of analysisLine.CNSActs) {
      const existingAct = await strapi
        .query("pricing")
        .findOne({ code: act.Code, type: "CNS" });
      if (existingAct !== null) {
        prices.push(existingAct.id);
      } else {
        missing.push(act.Code);
      }
    }
  }

  if (missing.length > 0) {
    logs.warnings.push({ code: analysisLine.Code, missingPrices: missing });
  }

  let conditions = [];
  if (analysisLine.Conditions !== undefined) {
    for (const cond of analysisLine.Conditions) {
      const existingCond = await strapi
        .query("codesaes")
        .findOne({ code: cond.Code, type: TYPE_CODE.CONDITION });
      if (existingCond !== null) {
        conditions.push(existingCond.id);
      } else {
        const condition = {
          code: cond.Code,
          label: cond.Name,
          code_system: cond.CodeSystem,
          add_original_text: cond.AddOriginalText,
          type: TYPE_CODE.CONDITION,
          created_by: userId,
          updated_by: userId,
        };
        const new_cond = await strapi.query("codesaes").create(condition);
        conditions.push(new_cond.id);
      }
    }
  }

  let target_sites = [];
  if (analysisLine.TargetSites !== undefined) {
    for (const site of analysisLine.TargetSites) {
      const existingSite = await strapi
        .query("codesaes")
        .findOne({ code: site.Code, type: TYPE_CODE.TARGET_SITE });
      if (existingSite !== null) {
        target_sites.push(existingSite.id);
      } else {
        const target_site = {
          code: site.Code,
          label: site.Name,
          code_system: site.CodeSystem,
          add_original_text: site.AddOriginalText,
          type: TYPE_CODE.TARGET_SITE,
          created_by: userId,
          updated_by: userId,
        };
        const new_site = await strapi.query("codesaes").create(target_site);
        target_sites.push(new_site.id);
      }
    }
  }

  const data = {
    version:
      existingEntry !== null && existingEntry.version !== undefined
        ? existingEntry.version + 1
        : 1,
    code: analysisLine.Code,
    label: analysisLine.Name,
    specimen: analysisLine.Specimen,
    conditions: conditions,
    target_sites: target_sites,
    prices: prices,
    created_by:
      existingEntry !== null && existingEntry.created_by !== undefined
        ? existingEntry.created_by
        : userId,
    updated_by: userId,
    histories:
      existingEntry !== null && existingEntry.histories !== undefined
        ? existingEntry.histories
        : [],
  };

  if (existingEntry !== null) {
    if (!analysisEquals(data, existingEntry)) {
      console.log("update : " + analysisLine.Code);

      const h = await createHistory(existingEntry);

      data.histories.push(h.id);

      await strapi.query("analysisaes").update({ id: existingEntry.id }, data);
      logs.updated = true;
    }
  } else {
    console.log("create : " + analysisLine.Code);
    await strapi.query("analysisaes").create(data);
    logs.created = true;
  }
  return logs;
};

module.exports = {
  createOrUpdate,
  createHistory,
};
