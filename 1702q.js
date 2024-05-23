function processSAWT1702(json, header) {

  var blankCells = findBlankCellsAndCheckCharacterLimits_SAWT1702(json);
  if (blankCells.length > 0) {
    alert('Errors found in rows: ' + blankCells.join(', '));
    return;
  }

  //Sort data
  var sortedData = json.slice(1).sort((a, b) => {
  if (a[2] < b[2]) return -1;
    if (a[2] > b[2]) return 1;
      return 0;
  });
  var sortedJson = [header].concat(sortedData);


  var result = convertToDATFormat_SAWT1702(sortedJson);
  var datContent = result.datContent;
  var datfile_fileName = result.datfile_fileName;
  var total = calculateTotal_SAWT1702(sortedJson);
  showPreview_SAWT1702(datContent, total, datfile_fileName);
}

function convertToDATFormat_SAWT1702(data) {
  // Get the header and reporting date details
  var reportingMonth = document.getElementById('reportingMonth').value;
  var reportingYear = document.getElementById('reportingYear').value;
  var reportingDate = reportingMonth + "/" + reportingYear;

  // Replace blank cells in columns 9 to 10 with zeros
  for (let i = 0; i < data.length; i++) {
    for (let j = 8; j <= 9; j++) { // Adjusted to cover columns 9 to 10
      if (!data[i][j]) {
        data[i][j] = 0;
      }
    }
  }

  // Preprocess the data to format column 2
  for (let i = 0; i < data.length; i++) {
    if (!data[i][1]) {
      data[i][1] = "0000";
    } else {
      data[i][1] = data[i][1].toString().slice(-4).padStart(4, '0');
    }
  }

  //DAT file header
  const datfile_type = "1702Q";
  const datfile_companyName = final_companyName === "" ? final_companyName : '"' + final_companyName + '"';
  const datfile_lastName = final_lastName === "" ? final_lastName : '"' + final_lastName + '"';
  const datfile_firstName = final_firstName === "" ? final_firstName : '"' + final_firstName + '"';
  const datfile_middleName = final_middleName === "" ? final_middleName : '"' + final_middleName + '"';

  //DAT filename
  const datfile_fileName = final_tpTIN + final_branchCode + reportingMonth + reportingYear + datfile_type + ".DAT";

  // Define the header rows
  const firstRow = [
    "HSAWT", 
    "H" + datfile_type, 
    final_tpTIN,
    final_branchCode,
    datfile_companyName,
    datfile_lastName,
    datfile_firstName,
    datfile_middleName,
    reportingDate,
    final_rdoCode,
  ];

  // Calculate sum of 9th to 10th columns
  const total = calculateTotal_SAWT1702(data);

  const content = [firstRow.join(',')]; // Join with commas

  content.push(...data.slice(1) // Exclude the first row (header)
    .map((row, rowIndex) => {
      // Get only the first 10 columns
      row = row.slice(0, 10);
      
      row.unshift("DSAWT", 'D' + datfile_type, rowIndex + 1); // Add "D1", datfile_type, and sequence number

      return row.map((cell, index) => {
        if (typeof cell === 'string') {
          // Convert to uppercase
          cell = cell.toUpperCase();
          // Remove special characters, replace "&" with "AND", and replace "Ñ" with "N"
          cell = cell.replace(/\s\s+/g, ' ').replace(/&/g, "AND").replace(/Ñ/g, "N").replace(/[^\w\s]|_/g, "");
          // Remove leading and trailing spaces
          cell = cell.trim();
          // Replace linebreak character with space character
          cell = cell.replace(/\r?\n|\r/g, ' ');
        }
        // Remove spaces and special characters, then trim to 9 characters in excel TIN column
        if (index === 3) { // Adjusted to account for unshift
          cell = cell.replace(/\W/g, '').substring(0, 9);
        }

        // Ensure number values in 9th to 10th columns have 2 decimal places
        if (index >= 10 && index <= 14) { // Adjusted to account for unshift
          if (!isNaN(cell) && parseFloat(cell) !== 0) {
            return parseFloat(Math.round(cell * 100) / 100).toFixed(2); // Round and ensure 2 decimal places
          }
        }
        // Round numeric values to 2 decimal places for other columns, ensuring they are not zero
        //if (!isNaN(cell) && typeof cell === 'number') {
          //return parseFloat(Math.round(cell * 100) / 100).toFixed(2);
        //}
        return cell;
        
      });
      return row; 
    })
    .map(row => {
      // Insert reportingDate between column 6 and 7 after modification
      row.splice(9, 0, reportingDate + ',');
      return row.map((cell, index) => {
        // Add quotes to the 6th to 9th columns
        if (index >= 5 && index <= 8) { // Adjusted to account for unshift
          return '"' + cell + '"';
        }
        return cell;
      }).join(',');
    }));

  // Add the final row
  const finalRow = [
    "CSAWT",
    'C' + datfile_type,
    final_tpTIN,
    final_branchCode,
    reportingDate,
    total[0].toFixed(2),
    total[1].toFixed(2)
  ].join(',');

  content.push(finalRow);

  var datContent = content.join('\n');
  return {datContent, datfile_fileName}
}

function calculateTotal_SAWT1702(data) {
  let total = [0, 0]; // Initialize totals for columns 9 to 10

  data.slice(1).forEach(row => {
    for (let colNum = 8; colNum <= 9; colNum++) { // Columns 9 to 10
      let cell = row[colNum];
      if (cell && !isNaN(cell)) { // Ensure cell is not empty and is a number
        total[colNum - 8] += parseFloat(cell); // Add cell value to total
      }
    }
  });
  return total;
}

function findBlankCellsAndCheckCharacterLimits_SAWT1702(data) {
  const allowedEntriesColumn7 = [
    "WI010", "WI011", "WI020", "WI021", "WI030", "WI031", "WI040", "WI041", "WI050", "WI051", 
    "WI060", "WI061", "WI070", "WI071", "WI080", "WI081", "WI090", "WI091", "WI100", "WI110", 
    "WI120", "WI130", "WI139", "WI140", "WI151", "WI150", "WI152", "WI153", "WI156", "WI159", 
    "WI640", "WI157", "WI158", "WI160", "WI515", "WI516", "WI530", "WI535", "WI540", "WI610", 
    "WI630", "WI632", "WI650", "WI651", "WI660", "WI661", "WI662", "WI663", "WI680", "WI710", 
    "WI720", "WC010", "WC011", "WC020", "WC021", "WC030", "WC031", "WC040", "WC041", "WC050", 
    "WC051", "WC060", "WC061", "WC070", "WC071", "WC080", "WC081", "WC100", "WC110", "WC120", 
    "WC139", "WC140", "WC151", "WC150", "WC156", "WC640", "WC157", "WC158", "WC160", "WC515", 
    "WC516", "WC535", "WC540", "WC610", "WC630", "WC632", "WC650", "WC651", "WC660", "WC661", 
    "WC662", "WC663", "WC680", "WC690", "WC710", "WC720"
  ];

  const invalidRows = [];
  for (let i = 1; i < data.length; i++) { // Skip header row
    if (!data[i][2]) { // Columns 3 (0-based index)
      invalidRows.push(i + 1); // Add 1 to convert 0-based index to 1-based row number
    }
    if (data[i][2] && data[i][2].length > 50) { // Column 3
      invalidRows.push(i + 1);
    }
    for (let colNum = 3; colNum <= 5; colNum++) { // Columns 4 to 6
      if (data[i][colNum] && data[i][colNum].length > 30) {
        invalidRows.push(i + 1);
      }
    }
    if (!allowedEntriesColumn7.includes(data[i][6])) { // Column 7
      invalidRows.push(i + 1);
    }
  }
  return invalidRows;
}

function showPreview_SAWT1702(datContent, total, datfile_fileName) {
  const previewModal = document.getElementById('previewModal');
  const existingFileModal = document.getElementById('existingFileModal');
  const existingFilemessage = document.getElementById('existingFilemessage');
  const previewData = document.getElementById('dataPreview');
  const downloadButton = document.getElementById('downloadButton');
  const yesButton = document.getElementById('yesButton');
  const previewFileName = document.getElementById('previewFileName');
  const previewTotal = document.getElementById('totalPreview');
  const reportingYear = document.getElementById('reportingYear').value;
  const reportingMonth = document.getElementById('reportingMonth').value;
  const transactionType = "SAWT_1702Q"

  //drive path 
  const folderPath = 'DATFiles/' + final_tpTIN + '/' + transactionType + '/' + reportingYear;

  // Get the last day of the reporting month
  const newDate = new Date(reportingYear, reportingMonth, 0);
  const lastDay = newDate.getDate();
  const reportingDate = reportingMonth + "/" + lastDay + "/" + reportingYear

  // Prepare totals display
  const totalsDisplay = `Total Creditable Withholding Tax: ${total[1].toFixed(2)}`;

  // Prepare existing file display
  const existingMessage = 'Existing File Found!' + "\n\n" + 'File Name: ' + datfile_fileName + '\n' + 'Transaction Type: ' + transactionType + '\n' + 'Reporting Period: '  + reportingDate + '\n\n\n' + 'Overwrite this file?';

  //Show loding pop-up
  document.getElementById("loadingPopup").style.display = "block"

  //save to Gdrive
  google.script.run.withSuccessHandler(function(response) {
    if(response === true){
      document.getElementById("loadingPopup").style.display = "none"
      existingFileModal.style.display = 'block';
      existingFilemessage.textContent = existingMessage;

      //add shaky effect
      document.getElementById('existingFileModal2').classList.add("shaky");

      yesButton.onclick = function() {
        google.script.run.deleteFileToDrive(datfile_fileName, folderPath);
        previewFileName.textContent = datfile_fileName;
        previewTotal.textContent = totalsDisplay + "\n\n"; // Display the final DAT content
        previewData.textContent = datContent; // Display the final DAT content
        existingFileModal.style.display = 'none'; // close exitingfile modal
        previewModal.style.display = 'block'; // Show the preview modal
        downloadButton.onclick = function() {downloadDATFile(datContent, datfile_fileName);};
        setTimeout(function() {
          google.script.run.uploadFileToDrive(datContent, datfile_fileName, folderPath);
          },1000);
      };
      return //cancel futher processing
    }else{
      document.getElementById("loadingPopup").style.display = "none"
      previewFileName.textContent = datfile_fileName;
      previewTotal.textContent = totalsDisplay + "\n\n"; // Display the final DAT content
      previewData.textContent = datContent; // Display the final DAT content
      previewModal.style.display = 'block'; // Show the modal
      downloadButton.onclick = function() {downloadDATFile(datContent, datfile_fileName);};
    }
  }).uploadFileToDrive(datContent, datfile_fileName, folderPath);
}