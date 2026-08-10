/**
 * ============================================================
 *  apps-script.gs
 *  Google Apps Script — Birthday Investigation Backend
 * ============================================================
 *
 *  HOW TO SET UP (takes ~5 minutes):
 *
 *  1. Open your Google Sheet
 *  2. Click Extensions → Apps Script
 *  3. Delete any existing code in the editor
 *  4. Paste the entire contents of this file
 *  5. Click Save (💾)
 *  6. Click Deploy → New Deployment
 *     - Type: Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  7. Click Deploy → copy the Web App URL
 *  8. Open app.js in your project
 *  9. On line 6, replace "YOUR_DEPLOYED_URL_HERE" with your URL
 *
 * ============================================================
 */

// ── CONFIG ───────────────────────────────────────────────────
// Leave this empty to use the sheet the script is bound to,
// OR paste a specific sheet ID if you want a different sheet.
const SHEET_ID = '';
const SHEET_NAME = 'Responses';   // tab name (created automatically)

// 🔐 SECRET TOKEN — must match SUBMIT_SECRET in app.js
const SECRET = 'gooner-vizag-2025';

// ── COLUMN HEADERS ───────────────────────────────────────────
const HEADERS = [
  'Timestamp',
  'Q1 — Gift Category',
  'Q2 — Character / Player',
  'Q3 — Illegal Other (GAWK GAWK)',
  'Q4 — Gift Type',
  'Q5 — Football Preferences',
  'Q6 — Gift Structure',
  'Q7 — Hot Wheels Pick',
  'Q8 — 2k/4k Money Question',
  'Q9 — Wishlist',
  'Q10 — BROOOO Reaction',
  "Q11 — DON'T Want",
  'Q12 — T-shirt Size',
  'Q12 — Jersey Size',
  'Q12 — Shoe Size',
  'Q13 — Final Security Question'
];

// ── MAIN HANDLER ─────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 🔐 Reject requests without the correct secret token
    if (data.secret !== SECRET) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = getOrCreateSheet();

    // Write headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#1a1a2e')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Append the answer row
    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.Q1_GiftCategory  || '',
      data.Q2_Character     || '',
      data.Q3_IllegalOther  || '',
      data.Q4_GiftType      || '',
      data.Q5_FootballPrefs || '',
      data.Q6_GiftStructure || '',
      data.Q7_HotWheels     || '',
      data.Q8_MoneyQuestion || '',
      data.Q9_Wishlist      || '',
      data.Q10_BROOO        || '',
      data.Q11_DontWant     || '',
      data.Q12_TshirtSize   || '',
      data.Q12_JerseySize   || '',
      data.Q12_ShoeSize     || '',
      data.Q13_FinalAnswer  || ''
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── GET / CREATE SHEET ───────────────────────────────────────
function getOrCreateSheet() {
  const ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

// ── TEST FUNCTION ────────────────────────────────────────────
// Run this manually in the Apps Script editor to verify setup.
function testInsert() {
  const fakeData = {
    Q1_GiftCategory  : 'One Piece merch',
    Q2_Character     : 'Luffy',
    Q3_IllegalOther  : '',
    Q4_GiftType      : 'Something I can display',
    Q5_FootballPrefs : 'Messi, Barcelona',
    Q6_GiftStructure : 'One really cool gift',
    Q7_HotWheels     : 'JDM',
    Q8_MoneyQuestion : 'One Piece figure probably',
    Q9_Wishlist      : 'Roronoa Zoro figure',
    Q10_BROOO        : 'Anime figure',
    Q11_DontWant     : 'Socks',
    Q12_TshirtSize   : 'L',
    Q12_JerseySize   : 'L',
    Q12_ShoeSize     : 'UK 9',
    Q13_FinalAnswer  : "You're buying me a GAWK GAWK"
  };

  const sheet = getOrCreateSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1a1a2e')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    fakeData.Q1_GiftCategory,
    fakeData.Q2_Character,
    fakeData.Q3_IllegalOther,
    fakeData.Q4_GiftType,
    fakeData.Q5_FootballPrefs,
    fakeData.Q6_GiftStructure,
    fakeData.Q7_HotWheels,
    fakeData.Q8_MoneyQuestion,
    fakeData.Q9_Wishlist,
    fakeData.Q10_BROOO,
    fakeData.Q11_DontWant,
    fakeData.Q12_TshirtSize,
    fakeData.Q12_JerseySize,
    fakeData.Q12_ShoeSize,
    fakeData.Q13_FinalAnswer
  ]);

  Logger.log('✅ Test row inserted successfully!');
  Logger.log('Sheet URL: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}
