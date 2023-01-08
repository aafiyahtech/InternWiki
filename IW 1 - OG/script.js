const API_KEY = 'keymea83uBF3sXe4F';
const BASE_ID = 'appZ3GuJeBak8ThRv';
const TABLE_NAME = 'tblDPUarjm1VvaMj6';

const endpoint = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Function to populate the dropdown with the list of industries
function populateDropdown() {
    axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    }).then(response => {
      const dropdown = document.getElementById('industry-dropdown');
      const industries = new Set();
      response.data.records.forEach(record => {
        industries.add(record.fields['Industry']);
      });
      industries.forEach(industry => {
        const option = document.createElement('option');
        option.value = industry;
        option.text = industry;
        dropdown.add(option);
      });
    }).catch(error => {
      console.error(error);
    });
  }
  
// Function to display a random record from the 'Name' column
function displayRandomRecord() {
    const selectedIndustry = document.getElementById('industry-dropdown').value;
    document.getElementById('loader').style.display = 'block';
    axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    }).then(response => {
        document.getElementById('loader').style.display = 'none';
      const records = response.data.records;
      if (records) {
        const filteredRecords = records.filter(record => {
          return record && record.fields && record.fields['Industry'] === selectedIndustry;
        });
        if (filteredRecords.length > 0) {
          const record = filteredRecords[Math.floor(Math.random() * filteredRecords.length)];
          
          if (record && record.fields && record.fields['Name']) {
            const name = record.fields['Name'];
            console.log(name);
            const container = document.getElementById('record-container');
            if (container) {
              container.innerHTML = name;
              
            }
          }
        }
      }
    }).catch(error => {
      console.error(error);
    });
  }

  window.onload = function() {
    displayRandomRecord();
  };
  
  // Add event listeners to the dropdown and submit button
document.getElementById('industry-dropdown').addEventListener('load', populateDropdown());
// document.getElementById('submit-button').addEventListener('click', displayRandomRecord);

// Add event listeners to the dropdown and submit button
document.getElementById('industry-dropdown').addEventListener('change', displayRandomRecord);
document.getElementById('submit-button').addEventListener('click', event => {
  event.preventDefault();
  displayRandomRecord();
});