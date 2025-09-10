const URL = {
  DOWNLOAD: CUSTOM_VARIABLES.backendUrl + "/manage-catalog-aes/downloadCatalog",
  UPLOAD: "/manage-catalog-aes/updateCatalog",
  GET_HISTORIES: "/imports?_sort=created_at:DESC&_limit=5&_type=AES"
};

const CONTENT_TYPE = {
  JSON: "application/json"
};

module.exports = {
  URL,
  CONTENT_TYPE
};