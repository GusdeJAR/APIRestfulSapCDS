const mongoose = require("mongoose");
const axios = require("axios");

async function indicators(req) {
  try {
    const { symbol, indicator, interval, month } = req?.req?.query || {};
    if (!symbol || !indicator || !interval) {
      throw new Error(
        "Faltan parámetros requeridos: 'symbol', 'indicator', 'interval'."
      );
    }
    // Conectar a la base de datos para buscar si el indicador ya existe
    const existingIndicator = await mongoose.connection
      .collection("INDICATORS")
      .findOne({ SYMBOL: symbol, INDICATOR: indicator, INTERVAL: interval });

    // Si existe lo retornamos
    if (existingIndicator) {
      return {
        indicator: existingIndicator,
      };
    }
    const Ainterval =
      interval === "1d"
        ? "daily"
        : interval === "1w"
        ? "weekly"
        : interval === "1m"
        ? "monthly"
        : interval;
    // Si no existe, obtenemos los datos de la API de Alpha Vantage
    const apiKey = "NB6JDC9T7TRK4KM8";
    const apiUrl = `https://www.alphavantage.co/query?function=${indicator}&symbol=${symbol}&interval=${Ainterval}&time_period=20&series_type=close&apikey=${apiKey}`;
    console.log("API URL:", apiUrl);
    const response = await axios.get(apiUrl);

    // Verificamos si la API devolvió datos válidos
    if (
      !response.data ||
      response.data["Note"] ||
      response.data["Error Message"]
    ) {
      throw new Error(
        response.data["Note"] ||
          response.data["Error Message"] ||
          "Error al obtener datos de la API."
      );
    }

    // Procesar los datos de la API
    const indicatorData = response.data["Technical Analysis: SMA"];
    if (!indicatorData) {
      throw new Error(
        "No se encontraron datos técnicos en la respuesta de la API."
      );
    }

    // Damos formato a los datos para ingresar el array de fechas y valores
    const formattedData = Object.entries(indicatorData).map(
      ([date, values]) => ({
        DATE: date,
        VALUE: values["SMA"],
      })
    );

    const newIndicator = {
      SYMBOL: symbol,
      INDICATOR: indicator,
      INTERVAL: interval,
      TIMEZONE: response.data["Meta Data"]["7: Time Zone"],
      DATA: formattedData,
    };

    // Insertar los datos en la colección
    await mongoose.connection.collection("INDICATORS").insertOne(newIndicator);

    return {
      message: "Indicador obtenido de la API y almacenado en la base de datos.",
      data: newIndicator,
    };
  } catch (error) {
    console.error("Error en getIndicator:", error.message);
    return req.error(500, `Error al obtener indicador: ${error.message}`);
  }
}

async function crudSimulation(req) {
  try {
    const action = req.req.query.action;

    if (!action) {
      throw new Error("El parámetro 'action' es obligatorio.");
    }

    switch (action) {
      case "get":
        try {
          let result;
          const simulationId = req?.req?.query?.idSimulation;
          const strategie = req?.req?.query?.strategie;
          const strategieid = req?.req?.query?.id;

          const baseFilter = { "DETAIL_ROW.ACTIVED": true };

          if (simulationId) {
            result = await mongoose.connection

              .collection("SIMULATION")
              .find({ ...baseFilter, idSimulation: simulationId })
              .toArray();
          } else if (strategie) {
            result = await mongoose.connection
              .collection("SIMULATION")
              .find({ ...baseFilter, STRATEGY_NAME: strategie })
              .toArray();
          } else if (strategieid) {
            result = await mongoose.connection
              .collection("SIMULATION")
              .find({ ...baseFilter, SIMULATION_ID: strategieid })
              .toArray();
          } else {
            result = await mongoose.connection
              .collection("SIMULATION")
              .find(baseFilter)
              .toArray();
          }

          return result;
        } catch (error) {
          console.error("Error al obtener simulaciones:", error);
          throw new Error("Error al obtener simulaciones");
        }

      case "delete":
        try {
          const { id, borrado } = req?.req?.query || {};

          if (!id) {
            throw new Error(
              "Se debe proporcionar el ID de la simulación a eliminar"
            );
          }

          const filter = { idSimulation: id };

          if (borrado === "fisic") {
            const existing = await mongoose.connection
              .collection("SIMULATION")
              .findOne(filter);
            console.log("🔍 Documento encontrado:", existing);
            if (!existing) {
              throw new Error(`No existe simulación con idSimulation=${id}`);
            }
            // Eliminación física
            const updateFields = {
              "DETAIL_ROW.$[].ACTIVED": false,
              "DETAIL_ROW.$[].DELETED": true,
            };

            const result = await mongoose.connection
              .collection("SIMULATION")
              .updateOne(filter, { $set: updateFields });
            console.log("🔍 [DEBUG] Resultado de updateOne:", result);
            if (result.modifiedCount === 0) {
              throw new Error("No se pudo marcar como eliminada la simulación");
            }

            return { message: "Simulación marcada como eliminada físicamente" };
          } else {
            // Eliminación lógica
            const updateFields = {
              "DETAIL_ROW.$[].ACTIVED": false,
              "DETAIL_ROW.$[].DELETED": false,
            };

            const result = await mongoose.connection
              .collection("SIMULATION")
              .updateOne(filter, { $set: updateFields });

            if (result.modifiedCount === 0) {
              throw new Error("No se pudo marcar como eliminada la simulación");
            }

            return { message: "Simulación marcada como eliminada lógicamente" };
          }
        } catch (error) {
          console.error("Error al eliminar simulación:", error);
          throw new Error("Error al eliminar simulación");
        }
      case "post":
        try {
          const {
            symbol,
            initial_investment,
            simulationName,
            startDate,
            endDate,
          } = req?.req?.query || {};

          if (
            !symbol ||
            !initial_investment ||
            !simulationName ||
            !startDate ||
            !endDate
          ) {
            throw new Error(
              "Faltan parámetros requeridos: 'symbol', 'initial_investment', 'simulationName', 'startDate', 'endDate'."
            );
          }

          const idUser = "USER_TEST";
          const idStrategy = "STRATEGY_001";

          switch (simulationName) {
            case "ReversionSimple":
              const apiKey = "NU1IF336TN4IBMS5";
              const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;
              const response = await axios.get(apiUrl);
              const optionsData = response.data["Time Series (Daily)"];

              if (!optionsData || Object.keys(optionsData).length === 0) {
                throw new Error(
                  "No se encontraron datos de precios históricos."
                );
              }

              // Convertir y filtrar precios por fecha
              const filteredPrices = Object.keys(optionsData)
                .filter((date) => date >= startDate && date <= endDate)
                .map((date) => ({
                  date,
                  close: parseFloat(optionsData[date]["4. close"]),
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

              if (filteredPrices.length < 5) {
                throw new Error(
                  "No hay suficientes datos para calcular la estrategia."
                );
              }

              const smaPeriod = 5;
              const smaValues = filteredPrices.map((_, i, arr) => {
                if (i < smaPeriod - 1) return null;
                const sum = arr
                  .slice(i - smaPeriod + 1, i + 1)
                  .reduce((acc, val) => acc + val.close, 0);
                return sum / smaPeriod;
              });

              let entryPrice = null,
                exitPrice = null,
                entryDate = null,
                exitDate = null;
              const signals = [];

              for (let i = smaPeriod; i < filteredPrices.length; i++) {
                const price = filteredPrices[i].close;
                const sma = smaValues[i];
                if (!sma) continue;

                if (!entryPrice && price < sma * 0.95) {
                  entryPrice = price;
                  entryDate = filteredPrices[i].date;
                  signals.push({
                    date: entryDate,
                    type: "BUY",
                    price: entryPrice,
                    reasoning: "Precio por debajo del 95% del SMA",
                  });
                } else if (entryPrice && price > sma * 1.05) {
                  exitPrice = price;
                  exitDate = filteredPrices[i].date;
                  signals.push({
                    date: exitDate,
                    type: "SELL",
                    price: exitPrice,
                    reasoning: "Precio por encima del 105% del SMA",
                  });
                  break;
                }
              }

              if (!entryPrice || !exitPrice) {
                throw new Error(
                  `No se identificaron puntos válidos de entrada/salida entre ${startDate} y ${endDate}. Prueba con un rango más amplio o diferente símbolo.`
                );
              }

              const investment = parseFloat(initial_investment);
              const unitsBought = investment / entryPrice;
              const totalExitValue = unitsBought * exitPrice;
              const totalProfit = totalExitValue - investment;
              const returnPercentage = totalProfit / investment;

              const simulation = {
                idSimulation: `SIM_${Date.now()}`,
                idUser,
                idStrategy,
                simulationName,
                symbol,
                startDate,
                endDate,
                amount: investment,
                specs: "Trend: bearish, Volatility: high",
                result: parseFloat(totalProfit.toFixed(2)),
                percentageReturn: parseFloat(
                  (returnPercentage * 100).toFixed(2)
                ),
                signals,
                DETAIL_ROW: [
                  {
                    ACTIVED: true,
                    DELETED: false,
                    DETAIL_ROW_REG: [
                      {
                        CURRENT: true,
                        REGDATE: new Date(),
                        REGTIME: new Date(),
                        REGUSER: "FIBARRAC",
                      },
                    ],
                  },
                ],
              };

              // Guardar simulación
              await mongoose.connection
                .collection("SIMULATION")
                .insertOne(simulation);

              // Guardar precios históricos en ZTPRICESHISTORY (una sola vez por símbolo)
              const historyCollection =
                mongoose.connection.collection("ZTPRICESHISTORY");

              await historyCollection.updateOne(
                { symbol },
                {
                  $set: { symbol, lastUpdated: new Date() },
                  $addToSet: {
                    prices: { $each: filteredPrices },
                  },
                },
                { upsert: true }
              );

              return { message: "Simulación creada exitosamente.", simulation };
          }
        } catch (error) {
          console.error("Error detallado:", error.message || error);
          throw new Error(
            `Error al crear la simulación: ${error.message || error}`
          );
        }

      case "update":
        try {
          const { id } = req?.req?.query || {};
          const simulation = req?.data?.simulation;

          if (!id) {
            throw new Error(
              "Se debe proporcionar el ID de la simulación a actualizar en query (param 'id')."
            );
          }

          if (!simulation?.simulationName) {
            throw new Error(
              "Se debe proporcionar un nuevo nombre para la simulación en 'simulation.simulationName'."
            );
          }

          const result = await mongoose.connection
            .collection("SIMULATION")
            .findOneAndUpdate(
              { idSimulation: id },
              {
                $set: {
                  simulationName: simulation.simulationName,
                },
              },
              {
                returnDocument: "after", // o "after" si estás usando MongoDB v4.2+
              }
            );

          console.log(result, result.value);
          // Si no se encontró documento
          if (!result) {
            // return plano, sin anidar para evitar que lo envuelvan doblemente
            return {
              "@odata.context": "$metadata#entsimulation",
              message: `No existe simulación con ID ${id}`,
            };
          }

          // Solo regresa una vez la estructura deseada, sin value adicional
          return {
            "@odata.context": "$metadata#entsimulation",
            message: "Nombre de simulación actualizado exitosamente.",
            simulation: result.value,
          };
        } catch (err) {
          console.error("Error al actualizar simulación:", err.message || err);
          throw new Error(
            `Error en UPDATE de simulación: ${err.message || err}`
          );
        }

      default:
        throw new Error(`Acción no soportada: ${action}`);
    }
  } catch (error) {
    console.error("Error en crudSimulation:", error.message);
    throw error;
  }
}

const connectToMongoDB = require("../../lib/mongo");

async function crudStrategies(req) {
  try {
    const action = req.req.query.action;
    if (!action) throw new Error("El parámetro 'action' es obligatorio.");

    await connectToMongoDB(); // conecta a Mongo
    //get start

    switch (action) {
      case "post":
        try {
          const strategyData = req.data?.strategy;
          const strategyID = strategyData?.ID;

          if (!strategyID) {
            return req.error(400, "Se requiere un ID.");
          }

          const existing = await Strategy.findOne({ ID: strategyID });
          if (existing) {
            return req.error(
              409,
              `Ya existe una estrategia con ID '${strategyID}'.`
            );
          }

          const newStrategy = new Strategy({
            ...strategyData,
            DETAIL_ROW: {
              ACTIVED: true,
              DELETED: false,
              DETAIL_ROW_REG: [
                {
                  CURRENT: true,
                  REGDATE: new Date(),
                  REGTIME: new Date(),
                  REGUSER: "FIBARRAC",
                },
              ],
            },
          });

          await newStrategy.save();

          return {
            message: "Estrategia creada correctamente.",
            strategy: newStrategy.toObject(),
          };
        } catch (error) {
          console.error("Error en postStrategy:", error.message);
          return req.error(500, `Error al crear estrategia: ${error.message}`);
        }
      case "update":
        try {
          const { id } = req?.req?.query || {};
          const strategyData = req.data?.strategy;

          if (!id) {
            return req.error(
              400,
              "Se debe proporcionar el ID de la estrategia en query (param 'id')."
            );
          }
          if (!strategyData) {
            return req.error(
              400,
              "Se debe proporcionar en el body un objeto 'strategy'."
            );
          }

          const updates = { ...strategyData };
          delete updates.ID;

          if (Object.keys(updates).length === 0) {
            return req.error(
              400,
              "Debe especificar al menos un campo distinto de 'ID' para actualizar."
            );
          }

          const existing = await Strategy.findOne({ ID: id });
          if (!existing) {
            return req.error(404, `No se encontró estrategia con ID '${id}'.`);
          }

          Object.assign(existing, updates);

          existing.DETAIL_ROW = existing.DETAIL_ROW || {
            ACTIVED: true,
            DELETED: false,
            DETAIL_ROW_REG: [],
          };
          existing.DETAIL_ROW.DETAIL_ROW_REG.push({
            CURRENT: true,
            REGDATE: new Date(),
            REGTIME: new Date(),
            REGUSER: "FIBARRAC",
          });

          await existing.save();
          return {
            message: "Estrategia actualizada correctamente.",
            strategy: existing.toObject(),
          };
        } catch (error) {
          console.error("Error en patchStrategy:", error.message);
          return req.error(
            500,
            `Error al actualizar estrategia: ${error.message}`
          );
        }

      case "delete":
        try {
          const { id, borrado } = req?.req?.query || {};

          if (!id) {
            return req.error(
              400,
              "Se debe proporcionar el ID de la estrategia en query (param 'id')."
            );
          }

          const strategy = await Strategy.findOne({ ID: id });

          if (!strategy) {
            return req.error(404, `No se encontró estrategia con ID '${id}'.`);
          }

          // Estructura base de DETAIL_ROW si no existe
          strategy.DETAIL_ROW = strategy.DETAIL_ROW || {
            ACTIVED: true,
            DELETED: false,
            DETAIL_ROW_REG: [],
          };

          // Marcar eliminación según el tipo
          if (borrado === "fisic") {
            // Borrado físico
            strategy.DETAIL_ROW.ACTIVED = false;
            strategy.DETAIL_ROW.DELETED = true;
          } else {
            // Borrado lógico
            strategy.DETAIL_ROW.ACTIVED = false;
            strategy.DETAIL_ROW.DELETED = false;
          }

          // Registrar cambio
          strategy.DETAIL_ROW.DETAIL_ROW_REG.push({
            CURRENT: true,
            REGDATE: new Date(),
            REGTIME: new Date(),
            REGUSER: "FIBARRAC",
          });

          await strategy.save();

          return {
            message: `Estrategia con ID '${id}' marcada como eliminada ${
              borrado === "fisic" ? "físicamente" : "lógicamente"
            }.`,
            strategy: strategy.toObject(),
          };
        } catch (error) {
          console.error("Error en deleteStrategy:", error.message);
          return req.error(
            500,
            `Error al eliminar estrategia: ${error.message}`
          );
        }

      default:
        throw new Error(`Acción no soportada: ${action}`);
    }
  } catch (error) {
    console.error("Error en crudStrategies:", error.message);
    throw error;
  }
}

//limit

async function company(req) {
  const Company = require("../models/mongoDB/company.js");
  try {
    // Buscar todas las empresas activas
    const companies = await Company.find({});
    return companies.map((c) => c.toObject());
  } catch (error) {
    console.error("Error en getCompany:", error.message);
    return req.error(500, `Error al obtener empresa(s): ${error.message}`);
  }
}

//Get PricesHistory
async function priceshistory(req) {
  try {
    let result;
    const { idPrice, strategy, productCode } = req?.req?.query || {};

    const collection = mongoose.connection.collection("ZTPRICESHISTORY");

    if (idPrice) {
      result = await collection.find({ idPrice }).toArray();
    } else if (strategy) {
      result = await collection.find({ STRATEGY_NAME: strategy }).toArray();
    } else if (productCode) {
      result = await collection.find({ PRODUCT_CODE: productCode }).toArray();
    } else {
      result = await collection.find({}).toArray();
    }

    return result;
  } catch (error) {
    console.error("Error al obtener registros de ZTPRICESHISTORY:", error);
    throw new Error("Error al obtener registros de ZTPRICESHISTORY");
  }
}

//get strategy
async function strategy(req) {
  const Strategy = require("../models/mongoDB/Strategy.js");

  try {
    // Buscar todas las estrategias activas y no eliminadas
    const strategies = await Strategy.find({
      "DETAIL_ROW.ACTIVED": true,
      "DETAIL_ROW.DELETED": false,
    });

    // Si no se encuentran estrategias, enviar un error 404
    if (strategies.length === 0) {
      return req.error(
        404,
        "No se encontraron estrategias activas y no eliminadas."
      );
    }

    // Si hay estrategias, devolverlas en formato objeto
    return strategies.map((s) => s.toObject());
  } catch (error) {
    console.error("Error en getStrategy:", error.message);
    return req.error(500, `Error al obtener estrategias: ${error.message}`);
  }
}

module.exports = {
  crudSimulation,
  crudStrategies,
  company,
  strategy,
  indicators,
  priceshistory,
};
