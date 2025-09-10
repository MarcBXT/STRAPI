const rootDir = process.cwd();

const COLUMNS = [
  "num",
  "label",
  "code",
  "coefficient",
  "price",
  "rule_cumulation",
  "rule_best_practices",
  "comment",
  "nomenclature_num",
  "nomenclature_label",
  "part_num",
  "part_label",
  "chapter_num",
  "chapter_label",
  "section_num",
  "section_label",
  "sub_section_num",
  "sub_section_label",
  "sub_sub_section_num",
  "sub_sub_section_label"
];

const HEADINGS = [[
  "No",
  "Libellé",
  "Code",
  "Coefficient",
  "Tarif",
  "Règle de cumul",
  "Règle de bonne pratique",
  "Remarque",
  "Nomenclature no",
  "Nomenclature libellé",
  "Partie no",
  "Partie libellé",
  "Chapitre no",
  "Chapitre libellé",  
  "Section no",
  "Section libellé",
  "Sous-section no",
  "Sous-section libellé",
  "Sous-sous-section no",
  "Sous-sous-section libellé"
]];

const PATHS = {
  UPLOAD_REP: rootDir + "/public/uploads"
};

const TYPE_IMPORT = "CNS";

module.exports = { 
  HEADINGS,
  COLUMNS,
  PATHS,
  TYPE_IMPORT
};