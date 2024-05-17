  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }

  //Initianl header value
  let final_tpTIN = "";
  let final_branchCode = "";
  let final_rdoCode = "";
  let final_entityType = "";
  let final_cycleType = "";
  let final_monthSelect = "";
  let final_companyName = "";
  let final_lastName = "";
  let final_firstName = "";
  let final_middleName = "";
  let final_tradeName = "";
  let final_subStreet = "";
  let final_street = "";
  let final_barangay = "" ;
  let final_cityMunicipality = "" ;
  let final_province = "";
  let final_zipCode = "";


  // JavaScript Validation
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    //Close login modal
    document.getElementById("loginModal").style.display = "none"; // Close the login modal

    // Show loading modal
    document.getElementById("loadingPopup").style.display = "block";  // Open loading modal

    // Get username and password values
    var username = document.getElementById('Username').value;
    var password = document.getElementById('Password').value;

    // Call Google Apps Script function to validate credentials
    google.script.run.withSuccessHandler(loginSuccess).validateCredentials(username, password);
  });


  // Handle login success
function loginSuccess(response) {
  if (response.success) {
    document.getElementById("loadingPopup").style.display = "none"; // Close the loading modal
    document.getElementById("loginModal").style.display = "none"; // Close the modal
    document.getElementById("loginBtn").style.display = "none"; // Hide the login button

      // Show success pop-up
      document.getElementById("successPopup").style.display = "block";
        // Hide success pop-up after 1 seconds
      setTimeout(function() {
            document.getElementById("successPopup").style.display = "none";
      }, 600);
      
    populateTINs();
    startLogoutTimer();
    startInactivityTimer();

    window.addEventListener('beforeunload', function(event) {
      logout(); // Call logout function before window is closed
    });

    //alert('Login sucessful!');
    document.getElementById("tabMenu").style.display = "block"; // Hide the login button
    // Redirect to another page or perform additional actions
  }else{
    if (response.error === 'invalidCredentials') {
      document.getElementById("loadingPopup").style.display = "none"; // close loading
      document.getElementById("loginModal").style.display = "block"; // show the login modal

      // Show error message
      document.getElementById("errorMessage").textContent = "Invalid username or password. Please try again.";
      document.getElementById("errorMessage").style.display = "block";

      // Add shaky animation to input fields
      document.getElementById("Username").classList.add("shaky");
      document.getElementById("Password").classList.add("shaky");
      document.getElementById("errorMessage").classList.add("shaky");

      // Remove shaky animation after 0.6s
      setTimeout(function() {
        document.getElementById("Username").classList.remove("shaky");
        document.getElementById("Password").classList.remove("shaky");
        document.getElementById("errorMessage").classList.remove("shaky");
      }, 600);

    } else if (response.error === 'activeUser'){
      document.getElementById("loadingPopup").style.display = "none"; // close loading
      document.getElementById("loginModal").style.display = "block"; // show the login modal

      // Show error message
      document.getElementById("errorMessage").textContent = "Error: There is already an active user.";
      document.getElementById("errorMessage").style.display = "block";

      // Add shaky animation to input fields
      document.getElementById("errorMessage").classList.add("shaky");

      // Remove shaky animation after 0.6s
      setTimeout(function() {
        document.getElementById("errorMessage").classList.remove("shaky");
      }, 600);
    }
  }
}

function startLogoutTimer() {
  // Check every second if window is still open
  var timer = setInterval(function() {
    if (!window || window.closed) {
      clearInterval(timer);
      logout(); // Call logout function if window is closed
    }
  }, 1000);
}

function startInactivityTimer() {
  // Check for user activity every second
  var timer = setInterval(function() {
    var currentTime = Date.now();
    if (currentTime - lastActivityTime > 600000) { // 10 minutes (600000 milliseconds)
      clearInterval(timer);
      logout(); // Logout if user is inactive for 10 minutes
      document.getElementById("errorMessage").textContent = "You've been inactive for 10 minutes. You've been logged out.";
      document.getElementById("errorMessage").style.display = "block"; // call error message
      document.getElementById("loginModal").style.display = "block"; //call login modal
    }
  }, 1000);

  // Track user activity
  document.addEventListener('mousemove', function() {
    lastActivityTime = Date.now();
  });

  document.addEventListener('keydown', function() {
    lastActivityTime = Date.now();
  });
}

function logout() {
  google.script.run.logout();
  document.getElementById('Username').value = "" //clear username value
  document.getElementById('Password').value = "" //clear passowrd value
  document.getElementById("loginBtn").style.display = "block"; //show login button
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}


  //Rdo Code scripts
  var numbers = [ "001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "17A", "17B", "018", "019", "020", "21A", "21B", "21C", "022", "23A", "23B", "024", "25A", "25B", "026", "027", "028", "029", "030", "031", "032", "033", "034", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "050", "051", "052", "53A", "53B", "54A", "54B", "055", "056", "057", "058", "059", "060", "061", "062", "063", "064", "065", "066", "067", "068", "069", "070", "071", "072", "073", "074", "075", "076", "077", "078", "079", "080", "081", "082", "083", "084", "085", "086", "087", "088", "089", "090", "091", "092", "93A", "93B", "094", "095", "096", "097", "098", "099", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115"
  ];

  var datalist = document.getElementById("numbers");

  numbers.forEach(function(number) {
    var option = document.createElement("option");
    option.value = number;
    datalist.appendChild(option);
  });

  var inputBox = document.getElementById("rdoCode");
  inputBox.addEventListener("blur", function() {
    var valid = false;
    numbers.forEach(function(number) {
      if (inputBox.value === number) {
        valid = true;
      }
    });
    if (!valid) {
      inputBox.value = "";
      //alert("Please select a valid number from the list.");
    }
  });

function toggleDateSelection() {
var dateType = document.getElementById("cycleType").value;
var monthSelect = document.getElementById("monthSelect");
        
    if (dateType === "calendar") {
        monthSelect.disabled = true;
        monthSelect.value = "12"; // Set December as default
    } else {
        monthSelect.disabled = false;
        monthSelect.value = "01"; // Set January as default
        var decemberOption = monthSelect.querySelector('option[value="12"]');
        decemberOption.disabled = true;
    }
}


  // TP classification
function toggleClassSelection() {
  var tpClassification = document.getElementById("entityType").value;

    if (tpClassification === "Non-Individual"){
      document.getElementById("companyName").disabled=false
      document.getElementById("companyName").placeholder="ABC CORP"
      document.getElementById("lastName").disabled=true
      document.getElementById("firstName").disabled=true
      document.getElementById("middleName").disabled=true
      document.getElementById("lastName").value=""
      document.getElementById("firstName").value=""
      document.getElementById("middleName").value=""
      document.getElementById("lastName").placeholder=""
      document.getElementById("firstName").placeholder=""
      document.getElementById("middleName").placeholder=""
    }
    if (tpClassification === "Individual"){
      document.getElementById("companyName").disabled=true
      document.getElementById("companyName").placeholder=""
      document.getElementById("companyName").value=""
      document.getElementById("lastName").disabled=false
      document.getElementById("lastName").placeholder="DELA CRUZ"
      document.getElementById("firstName").disabled=false
      document.getElementById("firstName").placeholder="JUAN"
      document.getElementById("middleName").disabled=false
      document.getElementById("middleName").placeholder="TAMAD"
    }
}

//Alphanumeric only in inputbox
function validateInput(input) {

  // Replace consecutive double spaces with a single space
  input.value = input.value.replace(/\s{2,}/g, ' ');

  // Replace non-alphanumeric characters and single spaces with empty string
  input.value = input.value.replace(/[^a-zA-Z0-9\s]/g, '');

  //Capitalize
  input.value = input.value.toUpperCase();
}

//submit header forms
function submitForm() {
    
  var errorcounter = 0;

  var tpTIN = document.getElementById("tpTIN");
  var branchCode = document.getElementById('branchCode');
  var rdoCode =document.getElementById('rdoCode');
  var entityType = document.getElementById('entityType');
  var cycleType = document.getElementById('cycleType');
  var monthSelect = document.getElementById('monthSelect');
  var companyName = document.getElementById('companyName');
  var lastName = document.getElementById('lastName');
  var firstName = document.getElementById('firstName');
  var middleName = document.getElementById('middleName');
  var tradeName = document.getElementById('tradeName');
  var subStreet = document.getElementById('subStreet');
  var street = document.getElementById('street');
  var barangay = document.getElementById('barangay');
  var cityMunicipality = document.getElementById('cityMunicipality');
  var province = document.getElementById('province');
  var zipCode = document.getElementById('zipCode');

    //login and add shaky effect

    //TIN
    if(tpTIN.value === "" || tpTIN.value.length<9){
      var errorcounter = errorcounter + 1;
      tpTIN.classList.add("shaky");
      tpTIN.style.borderColor = 'red';
      setTimeout(function() {
        tpTIN.classList.remove("shaky");
        }, 300);
    } else{tpTIN.style.borderColor = '#ccc'; }

    //brach code
    if(branchCode.value === "" || branchCode.value.length<4){
      var errorcounter = errorcounter + 1;
      branchCode.classList.add("shaky");
      branchCode.style.borderColor = 'red';
      setTimeout(function() {
        branchCode.classList.remove("shaky");
        }, 300);
    } else{branchCode.style.borderColor = '#ccc';}

    //rdo code
    if(rdoCode.value === ""){
      var errorcounter = errorcounter + 1;
      rdoCode.classList.add("shaky");
      rdoCode.style.borderColor = 'red';
      setTimeout(function() {
        rdoCode.classList.remove("shaky");
        }, 300);
    } else{rdoCode.style.borderColor = '#ccc';}

    //Non-Individual
    if(entityType.value === "Non-Individual" && companyName.value.trim() === ""){
      var errorcounter = errorcounter + 1;
      companyName.classList.add("shaky");
      companyName.style.borderColor = 'red';
      setTimeout(function() {
        companyName.classList.remove("shaky");
        }, 300);
    } else{
      lastName.style.borderColor = '#ccc';
      firstName.style.borderColor = '#ccc';
      middleName.style.borderColor = '#ccc';
      companyName.style.borderColor = '#ccc';
    }

    //Individual
    if(entityType.value === "Individual"){

      //Last Name
      if(lastName.value.trim() ===""){
        var errorcounter = errorcounter + 1;
        lastName.classList.add("shaky");
        lastName.style.borderColor = 'red';
        setTimeout(function() {
          lastName.classList.remove("shaky");
          }, 300);
      } else{lastName.style.borderColor = '#ccc';}

      //First Name
      if(firstName.value.trim() ===""){
        var errorcounter = errorcounter + 1;
        firstName.classList.add("shaky");
        firstName.style.borderColor = 'red';
        setTimeout(function() {
          firstName.classList.remove("shaky");
          }, 300);
      } else{firstName.style.borderColor = '#ccc';}

      //Middle Name
      if(middleName.value.trim() === ""){
        var errorcounter = errorcounter + 1;
        middleName.classList.add("shaky");
        middleName.style.borderColor = 'red';
        setTimeout(function() {
          middleName.classList.remove("shaky");
          }, 300);
      } else{middleName.style.borderColor = '#ccc';}

    }

    //Trade name
    if(tradeName.value.trim() === ""){
      var errorcounter = errorcounter + 1;
      tradeName.classList.add("shaky");
      tradeName.style.borderColor = 'red';
      setTimeout(function() {
        tradeName.classList.remove("shaky");
        }, 300);
    } else{tradeName.style.borderColor = '#ccc';}    

    //Street
    if(street.value === ""){
      var errorcounter = errorcounter + 1;
      street.classList.add("shaky");
      street.style.borderColor = 'red';
      setTimeout(function() {
        street.classList.remove("shaky");
        }, 300);
    } else{street.style.borderColor = '#ccc';}

    //Barangay
    if(barangay.value === ""){
      var errorcounter = errorcounter + 1;
      barangay.classList.add("shaky");
      barangay.style.borderColor = 'red';
      setTimeout(function() {
        barangay.classList.remove("shaky");
        }, 300);
    } else{barangay.style.borderColor = '#ccc';}

    //City and Municipality
    if(cityMunicipality.value === ""){
      var errorcounter = errorcounter + 1;
      cityMunicipality.classList.add("shaky");
      cityMunicipality.style.borderColor = 'red';
      setTimeout(function() {
        cityMunicipality.classList.remove("shaky");
        }, 300);
    } else{cityMunicipality.style.borderColor = '#ccc';}

    //Province
    if(province.value === ""){
      var errorcounter = errorcounter + 1;
      province.classList.add("shaky");
      province.style.borderColor = 'red';
      setTimeout(function() {
        province.classList.remove("shaky");
        }, 300);
    } else{province.style.borderColor = '#ccc';}

    //Zip Code
    if(zipCode.value === "" || zipCode.value.length <4){
      var errorcounter = errorcounter + 1;
      zipCode.classList.add("shaky");
      zipCode.style.borderColor = 'red';
      setTimeout(function() {
        zipCode.classList.remove("shaky");
        }, 300);
    } else{zipCode.style.borderColor = '#ccc';}


    // sucessfull submission
    if(errorcounter===0){
    

    document.getElementById("loadingPopup").style.display = "block";

    //setTimeout(function(){
    //document.getElementById("loadingPopup").style.display = "none";
    //}, 2000);

    var formData = {
    tpTIN: tpTIN.value,
    branchCode: branchCode.value,
    rdoCode: rdoCode.value,
    entityType: entityType.value,
    cycleType: cycleType.value,
    monthSelect: monthSelect.value,
    companyName: companyName.value.trim(),
    lastName: lastName.value.trim(),
    firstName: firstName.value.trim(),
    middleName: middleName.value.trim(),
    tradeName: tradeName.value.trim(),
    subStreet: subStreet.value.trim(),
    street: street.value.trim(),
    barangay: barangay.value.trim(),
    cityMunicipality: barangay.value.trim(),
    province: province.value.trim(),
    zipCode: zipCode.value
    };
    //google.script.run.submitForm(tpTIN);
    google.script.run.withSuccessHandler(updateSelectOptions).submitForm(formData);
    }
}

function updateSelectOptions(){
    // Reload the select options after updating the database
    google.script.run.withSuccessHandler(function(tins) {
    var  currentTIN = document.getElementById("tpTIN").value;
    var select = document.getElementById('loadTIN');
    select.innerHTML = ''; // Clear existing options

    var defaultOption = document.createElement('option');
    defaultOption.text = 'Select TIN';
    defaultOption.value = '';
    select.appendChild(defaultOption);
    
    tins.forEach(function(tin) {
      var option = document.createElement('option');
      option.text = tin;
      option.value = tin;
      select.appendChild(option);
    });
    select.value = currentTIN;
}).getTINs();
  // Show success pop-up
  //setTimeout(function(){
  //document.getElementById("successPopup").style.display = "block";
  //}, 500);

  // Hide success pop-up
  //setTimeout(function() {
  //document.getElementById("successPopup").style.display = "none";
  //}, 1000);

  //Hide loading pop up
  document.getElementById("loadingPopup").style.display = "none";
}

function updateForm() {
  var selectedTIN = document.getElementById('loadTIN').value;
  google.script.run.withSuccessHandler(updateFormFields).getDataForTIN(selectedTIN);
  document.getElementById("loadingPopup").style.display = "block";
}

function updateFormFields(data) {

  //declared input header value
  document.getElementById('tpTIN').value = data.tpTIN || ''; 
  document.getElementById('branchCode').value = data.branchCode || '';
  document.getElementById('rdoCode').value = data.rdoCode || '';
  document.getElementById('entityType').value = data.entityType || '';
  document.getElementById('cycleType').value = data.cycleType || '';
  document.getElementById('monthSelect').value = data.monthSelect || '';
  document.getElementById('companyName').value = data.companyName || '';
  document.getElementById('lastName').value = data.lastName || '';
  document.getElementById('firstName').value = data.firstName || '';
  document.getElementById('middleName').value = data.middleName || '';
  document.getElementById('tradeName').value = data.tradeName || '';
  document.getElementById('subStreet').value = data.subStreet || '';
  document.getElementById('street').value = data.street || '';
  document.getElementById('barangay').value = data.barangay || '';
  document.getElementById('cityMunicipality').value = data.cityMunicipality || '';
  document.getElementById('province').value = data.province || '';
  document.getElementById('zipCode').value = data.zipCode || '';

    //Initianl header value
  final_tpTIN = document.getElementById('tpTIN').value
  final_branchCode = document.getElementById('branchCode').value
  final_rdoCode = document.getElementById('rdoCode').value
  final_entityType = document.getElementById('entityType').value
  final_cycleType = document.getElementById('cycleType').value
  final_monthSelect = document.getElementById('monthSelect').value
  final_companyName = document.getElementById('companyName').value
  final_lastName = document.getElementById('lastName').value
  final_firstName = document.getElementById('firstName').value
  final_middleName = document.getElementById('middleName').value
  final_tradeName = document.getElementById('tradeName').value
  final_subStreet = document.getElementById('subStreet').value
  final_street = document.getElementById('street').value
  final_barangay = document.getElementById('barangay').value
  final_cityMunicipality = document.getElementById('cityMunicipality').value
  final_province = document.getElementById('province').value
  final_zipCode = document.getElementById('zipCode').value

  // update header data
  submitForm();

  // close loading pop-up
  setTimeout(function(){
  document.getElementById("loadingPopup").style.display = "none";
  }, 1000);

}

function populateTINs() {
  google.script.run.withSuccessHandler(function(tins) {
    var select = document.getElementById('loadTIN');
    tins.forEach(function(tin) {
      var option = document.createElement('option');
      option.value = tin;
      option.textContent = tin;
      select.appendChild(option);
    });
  }).getTINs();
}

var select = document.getElementById("reportingYear");
var currentYear = new Date().getFullYear();
for (var year = 2000; year <= 2100; year++) {
    var option = document.createElement("option");
    option.text = year;
    option.value = year;
    if (year === currentYear) {
      option.selected = true;
    }
    select.appendChild(option);
}

function checkFileType() {
  var fileInput = document.getElementById('fileUpload');
  var filePath = fileInput.value;
  if (!filePath.endsWith('.xlsx')) {
  alert('Please select a file with .xlsx extension.');
   fileInput.value = ''; // Clear the file input field
  }
}

function uploadFile() {
  // get Header data
    var tpDta = {
    tpTIN: document.getElementById('loadTIN').value,
    branchCode: branchCode.value,
    rdoCode: rdoCode.value,
    entityType: entityType.value,
    cycleType: cycleType.value,
    monthSelect: monthSelect.value,
    companyName: companyName.value.trim(),
    lastName: lastName.value.trim(),
    firstName: firstName.value.trim(),
    middleName: middleName.value.trim(),
    tradeName: tradeName.value.trim(),
    subStreet: subStreet.value.trim(),
    street: street.value.trim(),
    barangay: barangay.value.trim(),
    cityMunicipality: barangay.value.trim(),
    province: province.value.trim(),
    zipCode: zipCode.value
    };
  var loadTIN = document.getElementById('loadTIN').value;
  var reportingType = document.getElementById('reportingType').value;
  const fileInput = document.getElementById('fileUpload');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    if (loadTIN === '') {
      alert('Please update taxpayer details.');
      return; // Stop further processing
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  

    if (reportingType === 'vat_sales'){
      if (firstSheetName === 'vat_sales') { 
      const datContent = convertToDATFormat(json, workbook, tpDta);
      downloadDATFile(datContent);
      }else{
      alert('The first sheet name of the Excel file is not "'+ reportingType + '".');
      return; // Stop further processing
      }
    }

    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Please select an Excel file.');
  }
}

function convertToDATFormat(data, workbook, tpDta) {

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

  // Define the header rows
  const firstRow = [
  "H", 
  "S", 
  '"' + final_tpTIN + '"', //to be continued (05.16.2024)
  '"MARSTECH UNLIMITED SOLUTIONS AND TECHNOLOGY INC"', // Quote only for these values
  '"MONKEY"', // Blank character
  '"LUFFY"',
  '"NIKA"',
  '"MARSTECH UNLIMITED SOLUTIONS AND TECHNOLOGY INC"', // Quote only for these values
  '"3F PRRM BLDG 56 MO IGNACIA"', // Quote only for these values
  '"ST PALIGSAHAN QUEZON CITY"' // Quote only for these values
  ];

  // Calculate sum of 8th to 11th columns
  const total = calculateTotal(workbook);

  // Append totals to the first row
  for (let i = 0; i < total.length; i++) {
    firstRow.push(total[i].toFixed(2)); // Round the total to 2 decimal places and convert to string
  }

  // Append additional header
  firstRow.push("039", reportingDate, "12");

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
        row.unshift("D", "S"); // Add "D" to the beginning of each row
        row.push("225258335", reportingDate); // Append the extra values
        return row.map((cell, index) => {
        // Add quotes to the 3rd to 8th columns
          if (index >= 2 && index <= 8) {
            return '"' + cell + '"';
            }
        return cell;
        }).join(',');
    })).join('\n');
}

function calculateTotal(workbook) {
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

function downloadDATFile(datContent) {
  const blob = new Blob([datContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = '225258335S122023.DAT';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}