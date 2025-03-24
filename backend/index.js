const express = require('express')
const app = express();
const cors = require('cors');
const axios = require('axios')
const http = require('http');
const { initalizeSocket, sendMessageToSocketId } = require('./socket');
const server = http.createServer(app);
const dotenv = require('dotenv');
const fs = require('fs')
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dotenv.config();

initalizeSocket(server);

const ZAP_API_BASE = 'http://localhost:8080';
const API_KEY = process.env.API_KEY; // ZAP running on localhost with default port
var TARGET_URL = ""

let lastMessageId = 0; // Track last fetched message

// Function to fetch new messages incrementally
async function fetchNewMessages() {
  try {
    let response = await axios.get(`${ZAP_API_BASE}/JSON/core/view/messages/`, {
      params: { baseurl: TARGET_URL, start: lastMessageId, count: 10 }
    });

    let messages = response.data.messages;
    console.log(messages.length);
    if (messages.length > 0) {
      lastMessageId += messages.length; // Update last fetched message index
      console.log(messages.length);

      // Send new messages to the frontend
      await sendMessageToSocketId({ event: 'newZapMessages', data: messages });
      console.log(`Sent ${messages.length} new messages to frontend`);
    }
  } catch (error) {
    console.error("Error fetching ZAP messages:", error.message);
  }
}


const POLL_INTERVAL = 5000;


function mapAlertsToOwaspTop10(alerts) {
  // OWASP Top 10 Mapping (2021 version)
  const OWASP_TOP_10 = {
    "A01:2021 - Broken Access Control": ["Access Control", "Unauthorized"],
    "A02:2021 - Cryptographic Failures": ["SSL", "TLS", "HSTS", "Weak Encryption"],
    "A03:2021 - Injection": ["SQL Injection", "Command Injection", "Code Injection"],
    "A04:2021 - Insecure Design": ["Business Logic Flaws"],
    "A05:2021 - Security Misconfiguration": ["Open Directory", "Misconfiguration", "Debug Mode"],
    "A06:2021 - Vulnerable & Outdated Components": ["Outdated Software", "Library Version"],
    "A07:2021 - Identification & Authentication Failures": ["Weak Password", "Session Fixation", "MFA Missing"],
    "A08:2021 - Software & Data Integrity Failures": ["Untrusted Deserialization", "Tampering"],
    "A09:2021 - Security Logging & Monitoring Failures": ["Missing Logs", "No Alerts"],
    "A10:2021 - Server-Side Request Forgery (SSRF)": ["SSRF"]
  };

  // Function to categorize a single vulnerability
  function categorizeVulnerability(alertName) {
    for (const [category, keywords] of Object.entries(OWASP_TOP_10)) {
      if (keywords.some(keyword => alertName.includes(keyword))) {
        return category;
      }
    }
    return null; // Return null if no match found
  }

  // Update alerts array directly
  if (!alerts || alerts.length === 0) {
    return [];
  }

  alerts.forEach(alert => {
    let category = categorizeVulnerability(alert.alert);
    if (category) {
      alert.prediction = 0;
      alert.owasp_category = category;
    }
  });

  return alerts;
}




app.post('/zapscan', async (req, res) => {

  const url = req.body.url;


  try {


    async function runZapScanWithProgress(targetURL) {
      try {
        // Start a new ZAP session
        await axios.get(`${ZAP_API_BASE}/JSON/core/action/newSession/?apikey=${API_KEY}`);
        await sendMessageToSocketId({ event: 'progress', data: 'New ZAP session started.' });

        // Start Spider Scan
        const spiderResponse = await axios.get(`${ZAP_API_BASE}/JSON/spider/action/scan/?apikey=${API_KEY}&url=${encodeURIComponent(targetURL)}&recurse=true&handleRedirects=follow`);
        const spiderScanId = spiderResponse.data.scan;
        await sendMessageToSocketId({ event: 'progress', data: `Spider started with scan ID: ${spiderScanId}` });

        let spiderStatus = 0;
        do {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const statusResponse = await axios.get(`${ZAP_API_BASE}/JSON/spider/view/status/?apikey=${API_KEY}&scanId=${spiderScanId}`);
          spiderStatus = statusResponse.data.status;
          await sendMessageToSocketId({ event: 'progress', data: `Spider progress: ${spiderStatus}%` });
        } while (spiderStatus < 100);
        await sendMessageToSocketId({ event: 'progress', data: 'Spider scan completed.' });

        // Start Active Scan
        const scanResponse = await axios.get(`${ZAP_API_BASE}/JSON/ascan/action/scan/?apikey=${API_KEY}&url=${encodeURIComponent(targetURL)}&recurse=true&handleRedirects=follow`);
        const activeScanId = scanResponse.data.scan;
        await sendMessageToSocketId({ event: 'progress', data: `Active scan started with scan ID: ${activeScanId}` });

        let activeScanStatus = 0;
        do {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const statusResponse = await axios.get(`${ZAP_API_BASE}/JSON/ascan/view/status/?apikey=${API_KEY}&scanId=${activeScanId}`);
          activeScanStatus = statusResponse.data.status;
          await sendMessageToSocketId({ event: 'progress', data: `Active scan progress: ${activeScanStatus}%` });
        } while (activeScanStatus < 100);

        await sendMessageToSocketId({ event: 'progress', data: 'Active scan completed. Waiting for alerts...' });

        // Ensure scan is fully completed before fetching alerts
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Retrieve all alerts (no baseurl filter to avoid missing results)
        const alertsResponse = await axios.get(`${ZAP_API_BASE}/JSON/core/view/alerts/?apikey=${API_KEY}`);
        await sendMessageToSocketId({ event: 'progress', data: 'Scan results retrieved.' });

        return alertsResponse.data;
      } catch (error) {
        console.log(error);
        await sendMessageToSocketId({ event: 'error', data: 'Error during ZAP scan.' });
      }
    }

    const results = await runZapScanWithProgress(url);
    // console.log(results);


    // Convert JSON object to a string
    // console.log(alerts);
    // const alertsCopy = JSON.parse(JSON.stringify(alerts));
    // console.log(alertsCopy);
    var predictions = [];
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', results.alerts, { headers: { "Content-Type": "application/json" } });
      // console.log(response.data);

      predictions = response.data.prediction;
      // Parse JSON string into an array
      await sendMessageToSocketId({ event: 'progress', data: 'Comparing with owasp zap top 10' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      const alerts = mapAlertsToOwaspTop10(results.alerts);
      console.log(alerts);
      await sendMessageToSocketId({ event: 'progress', data: 'Preparing prediction' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      for (let i = 0; i < alerts.length; i++) {
        if (alerts[i].prediction == null)
          alerts[i].prediction = predictions[i];

        if (alerts[i].risk === "High") {
          alerts[i].prediction = 0;
        }
      }


      res.status(201).json({ results: alerts });
    } catch (error) {
      console.error('Error calling Flask API:', error.message);
      res.status(500).json({ error: error });
    }


    // // Write to file
    // fs.writeFile("scan_results.txt", jsonString, (err) => {
    //   if (err) {
    //     console.error("Error writing JSON file:", err);
    //   } else {
    //     console.log("JSON file saved as scan_results");
    //   }
    // });




  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.listen(5500, () => {
  console.log("Server started.....");
});