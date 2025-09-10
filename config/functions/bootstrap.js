'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
  if (process.env.NODE_ENV === 'development') {
    const params = {
      username: process.env.ADMIN_USERNAME || null,
      password: process.env.ADMIN_PASSWORD || null,
      firstname: process.env.ADMIN_FIRSTNAME || 'Admin',
      lastname: process.env.ADMIN_LASTNAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      blocked: false,
      isActive: true,
    };

    // Check valid params
    if (params.username && params.password) {
      // Check if any account exists.
      const admins = await strapi.query('user', 'admin').find();
      if (admins.length === 0) {
        try {
          let tempPass = params.password;
          let verifyRole = await strapi.query('role', 'admin').findOne({ code: 'strapi-super-admin' });
          if (!verifyRole) {
            verifyRole = await strapi.query('role', 'admin').create({
              name: 'Super Admin',
              code: 'strapi-super-admin',
              description: 'Super Admins can access and manage all features and settings.',
            });
          }
          params.roles = [verifyRole.id];
          params.password = await strapi.admin.services.auth.hashPassword(params.password);
          await strapi.query('user', 'admin').create({
            ...params,
          });
          strapi.log.info('Admin account was successfully created.');
          strapi.log.info(`Email: ${params.email}`);
          strapi.log.info(`Password: ${tempPass}`);
        } catch (error) {
          strapi.log.error(`Couldn't create Admin account during bootstrap: `, error);
        }
      }
    }
  }
};
