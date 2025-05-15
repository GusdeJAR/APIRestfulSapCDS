// Import libraries
const cds = require("@sap/cds");

const {
  DeleteRecord,
  CrudUsers,
  CrudValues,
  CrudRoles,
} = require("../services/sec-security-service");

// Principal structure controller class
class InversionsClass extends cds.ApplicationService {
  // Constructor
  async init() {
    this.on("crudUsers", async (req) => {
      try {
        return await CrudUsers(req);
      } catch (error) {
        req.error(400, error.message || "Error en crudUsers");
      }
    });

    this.on("crudValues", async (req) => {
      try {
        return await CrudValues(req);
      } catch (error) {
        req.error(400, error.message || "Error en crudValues");
      }
    });

    this.on("crudRoles", async (req) => {
      try {
        return await CrudRoles(req);
      } catch (error) {
        req.error(400, error.message || "Error en crudRoles");
      }
    });

    this.on("deleteAny", async (req) => {
      try {
        return await DeleteRecord(req);
      } catch (error) {
        req.error(400, error.message || "Error en deleteAny");
      }
    });

    return await super.init();
  }
}

// Export the controller class
module.exports = InversionsClass;
