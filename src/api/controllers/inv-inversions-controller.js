//Import libraries

const cds = require("@sap/cds");

const {
  crudSimulation,
  crudStrategies,
  company,
  strategy,
  indicators,
  priceshistory
} = require("../services/inv-inversions-services");

//Principal structure controller class

class InversionsClass extends cds.ApplicationService {
  //Constructor
  async init() {
    //Call method handler the parent constructor
    this.on("crudSimulation", async (req) => {
      try {
        return await crudSimulation(req);
      } catch (error) {
        req.error(400, error.message || "Error en crudSimulation");
      }
    });

    this.on("crudStrategies", async (req) => {
      try {
        return await crudStrategies(req);
      } catch (error) {
        req.error(400, error.message || "Error en crudStrategies");
      }
    });

    this.on("company", async (req) => {
      try {
        return await company(req);
      } catch (error) {
        req.error(400, error.message || "Error en company");
      }
    });

    this.on("strategy", async (req) =>{
      try {
        return await strategy(req);
      }catch (error) {
        req.error(400, error.message || "Error en strategy");
      }
    });

    this.on("indicators", async (req) => {
      try {
        return await indicators(req);
      } catch (error) {
        req.error(400, error.message || "Error en indicators");
      }
    } );


     this.on("priceshistory", async (req) => {
      try {
        return await priceshistory(req);
      } catch (error) {
        req.error(400, error.message || "Error en indicators");
      }
    } );

    return await super.init();
  } //cierre init
} //fin de la clase

// Export the controller class
module.exports = InversionsClass;
