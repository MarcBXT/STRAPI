'use strict';


/**
 * manage-catalog-aes.js controller
 *
 * @description: A set of functions called "actions" of the `manage-catalog-aes` plugin.
 */



module.exports = { 

  /**
   * import catalog via xlsx file.
   *
   * @return {Object}
   */
  import: async (ctx) => {
    const services = strapi.plugins["manage-catalog-aes"].services["manage-catalog-aes"];
    try {
      await services.importFile(ctx);
      
      return ctx.send({message: 'Import OK'});
    } catch (e) {
      console.log(e);
      if (e.statusCode === 400) {
        return ctx.response.badRequest("error", [e.detail]);
      } else {
        return ctx.response.serverUnavailable("error", [e.detail]);
      }      
    }       
  },

  export: async (ctx) => {
    const services = strapi.plugins["manage-catalog-aes"].services["manage-catalog-aes"];
    try {
      const buffer = await services.exportFile(ctx);

      ctx.status = 200;
      ctx.type = 'application/json';
      ctx.set('Content-Length', buffer.length);
      
      return ctx.send(buffer);
    } catch (e) {
      console.log(e);
      if (e.statusCode === 400) {
        return ctx.response.badRequest("error", [e.detail]);
      } else {
        return ctx.response.serverUnavailable("error", [e.detail]);
      }      
    }       
  }
};
