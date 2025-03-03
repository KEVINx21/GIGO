// Please open Google sheets > open  new sheet > Extension option > App script > open Web Page option > type this code below into it> save and deploy > copy the webpage URL > paste in HTML Page where it will be mentioned


function doGet(e) {
  return ContentService.createTextOutput("Web App is live!");
}

function doPost(e) {
  try {
    // Retrieve the recognizedText parameter from form data
    var recognizedText = e.parameter.recognizedText || "NO_TEXT";
    
    // Get current date and time
    var now = new Date();
    var date = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
    var time = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss");
    
    // Open the spreadsheet using its ID and select the desired sheet
    var sheet = SpreadsheetApp.openById("1D_3tJ5ex4EKccoxOBw_jH19kxA50EJ1xnVb8N9wsscM").getSheetByName("Sheet1");
    if (!sheet) {
      return ContentService.createTextOutput("Sheet not found");
    }
    
    // Append the new row
    sheet.appendRow([date, time, recognizedText]);
    
    // Return a simple success message
    return ContentService.createTextOutput("Logged successfully");
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString());
  }
}
