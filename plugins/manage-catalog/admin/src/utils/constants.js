const URL = {
  DOWNLOAD: CUSTOM_VARIABLES.backendUrl + "/manage-catalog/downloadCatalog",
  UPLOAD: "/manage-catalog/updateCatalog",
  GET_HISTORIES: "/imports?_sort=created_at:DESC&_limit=5&_type=BNXT"
};

const CONTENT_TYPE = {
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

module.exports = {
  URL,
  CONTENT_TYPE
};