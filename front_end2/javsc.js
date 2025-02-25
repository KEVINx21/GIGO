// netlify/functions/appendToSheet.js

const { google } = require('googleapis');

// Handler function for the Netlify Function
exports.handler = async (event, context) => {
  // Allow CORS for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  // Set CORS headers for the response
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const { recognizedText } = JSON.parse(event.body);
    if (!recognizedText) throw new Error('recognizedText missing');

    // Get current date and time
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS

    // Authenticate with Google using the service account JSON stored in env variables
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append the new row to the spreadsheet
    const spreadsheetId = '1D_3tJ5ex4EKccoxOBw_jH19kxA50EJ1xnVb8N9wsscM';  // Replace with your Google Sheet ID
    const range = 'Sheet1!A1'; // Adjust sheet name if needed
    const requestBody = {
      values: [[date, time, recognizedText]]
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Logged successfully' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};
