const axios = require("axios");
const { MongoClient } = require("mongodb");

// Configura tus datos
const apiKey = "NU1IF336TN4IBMS5";
const symbols = [ "NVDA",  // NVIDIA
  "TSLA",  // Tesla
  "AMD",   // AMD
  "INTC",  // Intel
  "JPM"   // JPMorgan Chase
  ];
const mongoUri = "mongodb+srv://admin:hzOwV9Q84eoEj8yB@clusterprueba.yyrlk.mongodb.net/";

// Función principal
async function fetchAndStoreCompanyInfo() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db("db_esecurity");
    const collection = db.collection("EMPRESAS");

    for (const symbol of symbols) {
      console.log(`⏳ Consultando: ${symbol}`);

      const url = "https://www.alphavantage.co/query";
      const params = {
        function: "OVERVIEW",
        symbol,
        apikey: apiKey,
      };

      const response = await axios.get(url, { params });
      const companyData = response.data;

      if (companyData && companyData.Symbol) {
        await collection.updateOne(
          { Symbol: companyData.Symbol },
          { $set: companyData },
          { upsert: true }
        );
        console.log(`✅ Guardado en MongoDB: ${symbol}`);
      } else {
        console.warn(`⚠️ Sin datos válidos para ${symbol}:`, companyData.Note || companyData);
      }

      // Esperar para no exceder el límite de la API (5 peticiones por minuto en modo gratuito)
      await new Promise((resolve) => setTimeout(resolve, 15000));
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
  }
}

fetchAndStoreCompanyInfo();
