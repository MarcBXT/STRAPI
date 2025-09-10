'use strict';
const moment = require('moment');


/**
 * pricing.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const priceEquals = (newAn, oldAn) => {
  
  const isEqual =
          newAn.code === oldAn.code 
          && newAn.label === oldAn.label
          && newAn.price === oldAn.price
          && newAn.coefficient === oldAn.coefficient
          && newAn.rule_cumulation === oldAn.rule_cumulation
          && newAn.rule_best_practices === oldAn.rule_best_practices
          && newAn.comment === oldAn.comment
          && (newAn.part === null && oldAn.part === null || (newAn.part !== null && oldAn.part !== null && newAn.part === oldAn.part.id))
          && (newAn.chapter === null && oldAn.chapter === null || (newAn.chapter !== null && oldAn.chapter !== null && newAn.chapter === oldAn.chapter.id))
          && (newAn.section === null && oldAn.section === null || (newAn.section !== null && oldAn.section !== null && newAn.section === oldAn.section.id))
          && (newAn.sub_section === null && oldAn.sub_section === null || (newAn.sub_section !== null && oldAn.sub_section !== null && newAn.sub_section === oldAn.sub_section.id))
          && (newAn.sub_sub_section === null && oldAn.sub_sub_section === null || (newAn.sub_sub_section !== null && oldAn.sub_sub_section !== null && newAn.sub_sub_section === oldAn.sub_sub_section.id));

  return isEqual; 
};

const createHistory = async (existingEntry) => {
  const history = {
    version: existingEntry.version,
    code: existingEntry.code,
    label: existingEntry.label,
    type: existingEntry.type,
    price: existingEntry.price,
    coefficient: existingEntry.coefficient,
    code_rule_cumulation: existingEntry.code_rule_cumulation,
    rule_cumulation: existingEntry.rule_cumulation,
    rule_best_practices: existingEntry.rule_best_practices,
    comment: existingEntry.comment,
    part: existingEntry.part,
    chapter: existingEntry.chapter,
    section: existingEntry.section,
    sub_section: existingEntry.sub_section,
    sub_sub_section: existingEntry.sub_sub_section,
    created_by: existingEntry.created_by,
    updated_by: existingEntry.updated_by,
    start_date: existingEntry.updated_at,
    end_date: moment().toISOString()
  };

  return await strapi.query("pricing-h").create(history);
};

const createOrUpdate = async (line, userId) => {
  let logs = {
    created: false,
    updated: false
  };

  const existingEntry = await strapi.query('pricing').findOne({code: line.code, type: line.type});

  let existingPart = null;
  if (line.part_num !== null) {
    existingPart = await strapi.query('codescns').findOne({ code: line.part_num, type: 'PART' });
    if (existingPart === null) {
      const newCode = { 
        code: line.part_num,
        type: 'PART',
        label: line.part_label,
        created_by: userId,
        updated_by: userId
      };
      existingPart = await strapi.query('codescns').create(newCode);
    }
  }

  let existingChapter = null;
  if (line.chapter_num !== null) {
    existingChapter = await strapi.query('codescns').findOne({ code: line.chapter_num, type: 'CHAPTER' });
    if (existingChapter === null) {
      const newCode = { 
        code: line.chapter_num,
        type: 'CHAPTER',
        label: line.chapter_label,
        created_by: userId,
        updated_by: userId
      };
      existingChapter = await strapi.query('codescns').create(newCode);
    }
  }
  
  let existingSection = null;
  if (line.section_num !== null) {
    existingSection = await strapi.query('codescns').findOne({ code: line.section_num, type: 'SECTION' });
    if (existingSection === null) {
      const newCode = { 
        code: line.section_num,
        type: 'SECTION',
        label: line.section_label,
        created_by: userId,
        updated_by: userId
      };
      existingSection = await strapi.query('codescns').create(newCode);
    }
  }

  let existingSubSection = null;
  if (line.sub_section_num !== null) {
    existingSubSection = await strapi.query('codescns').findOne({ code: line.sub_section_num, type: 'SUB_SECTION' });
    if (existingSubSection === null) {
      const newCode = { 
        code: line.sub_section_num,
        type: 'SUB_SECTION',
        label: line.sub_section_label,
        created_by: userId,
        updated_by: userId
      };
      existingSubSection = await strapi.query('codescns').create(newCode);
    }
  }

  let existingSubSubSection = null;
  if (line.sub_sub_section_num !== null) {
    existingSubSubSection = await strapi.query('codescns').findOne({ code: line.sub_sub_section_num, type: 'SUB_SUB_SECTION' });
    if (existingSubSubSection === null) {
      const newCode = { 
        code: line.sub_sub_section_num,
        type: 'SUB_SUB_SECTION',
        label: line.sub_sub_section_label,
        created_by: userId,
        updated_by: userId
      };
      existingSubSubSection = await strapi.query('codescns').create(newCode);
    }
  }

  const data = {   
    version: existingEntry !== null && existingEntry.version !== undefined ? existingEntry.version + 1 : 1,
    type: line.type,
    code: line.code,
    label: line.label,
    price: line.price,
    coefficient: line.coefficient,
    code_rule_cumulation: line.code_rule_cumulation,
    rule_cumulation: line.rule_cumulation,
    rule_best_practices: line.rule_best_practices,
    comment: line.comment,
    part: existingPart !== null ? existingPart.id : null,
    chapter: existingChapter !== null ? existingChapter.id : null,
    section: existingSection !== null ? existingSection.id : null,
    sub_section: existingSubSection !== null ? existingSubSection.id : null,
    sub_sub_section: existingSubSubSection !== null ? existingSubSubSection.id : null,
    created_by: existingEntry !== null && existingEntry.created_by !== undefined ? existingEntry.created_by : userId,
    updated_by: userId,
    histories: existingEntry !== null && existingEntry.histories !== undefined ? existingEntry.histories : []
  };
  
  if (existingEntry !== null) {
    if (!priceEquals(data, existingEntry)) {
      
      console.log("update : " + line.code);
      
      const h = await createHistory(existingEntry);

      data.histories.push(h.id);

      await strapi.query("pricing").update({id: existingEntry.id}, data);
      logs.updated = true;
    }
  } else {
    console.log("create : " + line.code);
    await strapi.query('pricing').create(data);
    logs.created = true;
  }
  return logs;
}

module.exports = {
  createOrUpdate,
  createHistory  
};
