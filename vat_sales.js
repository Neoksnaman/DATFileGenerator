function convertToDATFormat_S(data, workbook, tpDta) {

  // Get the header and reporting date details
  var reportingMonth = document.getElementById('reportingMonth').value;
  var reportingYear = document.getElementById('reportingYear').value;

  var newDate = new Date(reportingYear, reportingMonth, 0);
  var lastDay = newDate.getDate();
  var reportingDate = reportingMonth + "/" + lastDay + "/" + reportingYear


  // Replace blank cells in columns 8 to 11 with zeros
  for (let i = 0; i < data.length; i++) {
    for (let j = 7; j < 11; j++) {
      if (!data[i][j]) {
      data[i][j] = 0;
      }
    }
  }

  //DAT file header
  datfile_type = "S" //stands for Sales
  datfile_tpTIN = final_tpTIN === "" ? final_tpTIN : '"' + final_tpTIN + '"';
  datfile_companyName = final_companyName === "" ? final_companyName : '"' + final_companyName + '"';
  datfile_lastName = final_lastName === "" ? final_lastName : '"' + final_lastName + '"';
  datfile_firstName = final_firstName === "" ? final_firstName : '"' + final_firstName + '"';
  datfile_middleName = final_middleName === "" ? final_middleName : '"' + final_middleName + '"';
  dafile_tradeName = final_tradeName === "" ? final_tradeName : '"' + final_tradeName + '"';
  datfile_address1 = `"${final_subStreet ? final_subStreet + ' ' : ''}${final_street} ${final_barangay}"`;
  datfile_address2 = `"${final_cityMunicipality} ${final_province} ${final_zipCode}"`;

  //DAT filename
  datfile_fileName = final_tpTIN + datfile_type + reportingMonth + reportingYear + ".DAT"

  // Define the header rows
  const firstRow = [
  "H", 
  datfile_type, 
  datfile_tpTIN,
  datfile_companyName,
  datfile_lastName,
  datfile_firstName,
  datfile_middleName,
  dafile_tradeName,
  datfile_address1,
  datfile_address2
  ];

  // Calculate sum of 8th to 11th columns
  const total = calculateTotal_S(workbook);

  // Append totals to the first row
  for (let i = 0; i < total.length; i++) {
    firstRow.push(total[i].toFixed(2)); // Round the total to 2 decimal places and convert to string
  }

  // Append additional header
  firstRow.push(final_rdoCode, reportingDate, final_monthSelect);

  const content = [firstRow.join(',')]; // Join with commas
            
  return content.concat(data.slice(1) // Exclude the first row (header)
    .map(row => {
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
      if (index === 0) {
      cell = cell.replace(/\W/g, '').substring(0, 9);
      }
    
      // Ensure number values in 8th to 11th columns have 2 decimal places
      if (index >= 7 && index <= 10) {
        if (!isNaN(cell) && parseFloat(cell) !== 0) {
          return parseFloat(Math.round(cell * 100) / 100).toFixed(2); // Round and ensure 2 decimal places
        } else {
        return "0"; // Ensure zero is displayed as "0"
        }
      }

      // Round numeric values to 2 decimal places for other columns, ensuring they are not zero
      if (!isNaN(cell) && typeof cell === 'number') {
        return parseFloat(Math.round(cell * 100) / 100).toFixed(2);
      }

    return cell;
    });
  })

  .map(row => {
    row.unshift("D", datfile_type); // Add "D" and transaction type to the beginning of each row
    row.push(final_tpTIN, reportingDate); // Append TP TIN and Reporting date and end of each row
    return row.map((cell, index) => {

    // Add quotes to the 3rd to 8th columns
    if (index >= 2 && index <= 8) {
      return '"' + cell + '"';
    }
    return cell;
    }).join(',');

  })).join('\n');
}

function calculateTotal_S(workbook) {
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const range = XLSX.utils.decode_range(worksheet['!ref']);

  let total = [0, 0, 0, 0]; // Initialize totals for columns 8 to 11

  for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
  for (let colNum = 7; colNum <= 10; colNum++) { // Columns 8 to 11
  const cell = worksheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
    if (cell && cell.v && !isNaN(cell.v)) {
      total[colNum - 7] += cell.v; // Add cell value to total
      }
    }
  }

  return total;
}

function findBlankCellsAndCheckCharacterLimits_S(data) {
  const invalidRows = [];
  for (let i = 1; i < data.length; i++) { // Skip header row
    if (!data[i][1] || !data[i][5] || !data[i][6]) { // Columns 2, 6, and 7 (0-based index)
      invalidRows.push(i + 1); // Add 1 to convert 0-based index to 1-based row number
    }
    if (data[i][1] && data[i][1].length > 50) { // Column 2
      invalidRows.push(i + 1);
    }
    for (let colNum = 2; colNum <= 6; colNum++) { // Columns 3 to 7
      if (data[i][colNum] && data[i][colNum].length > 30) {
        invalidRows.push(i + 1);
      }
    }
  }
  return invalidRows;
}