// Please open Google sheets > open 2 new sheets named : Log and Latest > Extension option > App script > open Web Page option > type this code below into it> save and deploy > copy the webpage URL > paste in HTML Page where it will be mentioned



function doGet(e) {
  return ContentService.createTextOutput("Web App is live!");
}

function doPost(e) {
  try {
    // Get the recognized text from form data (sent as application/x-www-form-urlencoded)
    var recognizedText = e.parameter.recognizedText || "NO_TEXT";
    
    // Get current date and time
    var now = new Date();
    var date = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
    var time = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss");
    var newRow = [date, time, recognizedText];
    
    // Open the spreadsheet by ID
    var ss = SpreadsheetApp.openById("1eqbLAWIsl0X5_SNiJYJpVFl702QybWwHQrSEluVwB0M");
    
    // --- LOG SHEET: Append all records ---
    var logSheet = ss.getSheetByName("Log");
    if (!logSheet) {
      // Create the Log sheet and add headers if it doesn't exist
      logSheet = ss.insertSheet("Log");
      logSheet.appendRow(["Date", "Time", "Plate number"]);
    }
    logSheet.appendRow(newRow);
    
    // --- LATEST SHEET: Clear previous records and add only the new one ---
    var latestSheet = ss.getSheetByName("Latest");
    if (!latestSheet) {
      // Create the Latest sheet and add headers if it doesn't exist
      latestSheet = ss.insertSheet("Latest");
      latestSheet.appendRow(["Date", "Time", "Plate number"]);
    } else {
      // Clear all contents and re-add headers
      latestSheet.clearContents();
      latestSheet.appendRow(["Date", "Time", "Plate number"]);
    }
    latestSheet.appendRow(newRow);
    
    // Return success message (no custom headers needed when using form data)
    return ContentService.createTextOutput(JSON.stringify({message: "Logged successfully"}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
