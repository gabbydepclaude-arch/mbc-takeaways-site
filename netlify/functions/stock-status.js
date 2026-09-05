// Netlify serverless function — fetches the stock-control Google Sheet
// server-side (where CORS rules don't apply at all) and hands the CSV back
// to the browser from the site's own domain. This removes any dependency
// on whether Google's publish endpoint grants cross-origin permission to
// browser-side JavaScript.
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5DouRAenyqBhQK2ROlYfBnxrU-qc8boWB3EYAD642I2R41dVjYvy6ENGt1IID3Kg2pop3P_B9RzsI/pub?output=csv";

exports.handler = async function () {
  try {
    const res = await fetch(SHEET_CSV_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      throw new Error('Upstream sheet fetch failed with status ' + res.status);
    }
    const text = await res.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Error fetching stock sheet: ' + err.message
    };
  }
};
