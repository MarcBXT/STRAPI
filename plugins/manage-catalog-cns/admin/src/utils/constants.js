const URL = {
  DOWNLOAD: CUSTOM_VARIABLES.backendUrl + "/manage-catalog-cns/downloadCatalog",
  UPLOAD: "/manage-catalog-cns/updateCatalog",
  GET_HISTORIES: "/imports?_sort=created_at:DESC&_limit=5&_type=CNS"
};

const CONTENT_TYPE = {
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

module.exports = {
  URL,
  CONTENT_TYPE
};