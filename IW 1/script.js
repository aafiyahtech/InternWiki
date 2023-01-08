const API_KEY = 'keymea83uBF3sXe4F';
const BASE_ID = 'appZ3GuJeBak8ThRv';
const TABLE_NAME = 'tblDPUarjm1VvaMj6';

const endpoint = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// axios.get(endpoint, {
//   headers: {
//     'Authorization': `Bearer ${API_KEY}`
//   }
// }).then(response => {
//   console.log(response.data.records);
// }).catch(error => {
//   console.error(error);
// });

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
  


// Function to populate the category dropdown based on the selected industry
// function populateCategoryDropdown() {
//   const selectedIndustry = document.getElementById('industry-dropdown').value;
//   axios.get(endpoint, {
//     headers: {
//       'Authorization': `Bearer ${API_KEY}`
//     }
//   }).then(response => {
//     const records = response.data.records;
//     if (records) {
//       const categories = new Set();
//       records.forEach(record => {
//         if (record && record.fields && record.fields['Industry'] === selectedIndustry && record.fields['Category']) {
//           categories.add(record.fields['Category']);
//         }
//       });
//       const categoryDropdown = document.getElementById('category-dropdown');
//       categoryDropdown.innerHTML = '';
//       categories.forEach(category => {
//         const option = document.createElement('option');
//         option.value = category;
//         option.innerHTML = category;
//         categoryDropdown.appendChild(option);
//       });
//     }
//   }).catch(error => {
//     console.error(error);
//   });

// }

// Function to populate the category dropdown based on the selected industry
function populateCategoryDropdown() {
  
  const selectedIndustry = document.getElementById('industry-dropdown').value;
  const categories = new Set();

  document.getElementById('loader').style.display = 'block';
  const getRecords = (offset) => {
    axios.get(`${endpoint}?offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    }).then(response => {
      const records = response.data.records;
      if (records) {
        records.forEach(record => {
          if (record && record.fields && record.fields['Industry'] === selectedIndustry && record.fields['Category']) {
            categories.add(record.fields['Category']);
          }
        });
        if (response.data.offset) {
          getRecords(response.data.offset);
        } else {
          document.getElementById('loader').style.display = 'none';
          const categoryDropdown = document.getElementById('category-dropdown');
          categoryDropdown.innerHTML = '';
          categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.innerHTML = category;
            categoryDropdown.appendChild(option);
            
          });
        }
      }
    }).catch(error => {
      console.error(error);
    });
  };
  getRecords(0);
}



// Function to display a random record from the 'Name' column
function displayRandomRecord() {
  const selectedIndustry = document.getElementById('industry-dropdown').value;
  const selectedCategory = document.getElementById('category-dropdown').value;
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
        return record && record.fields && record.fields['Industry'] === selectedIndustry && record.fields['Category'] === selectedCategory;
      });
      if (filteredRecords.length > 0) {
        const record = filteredRecords[Math.floor(Math.random() * filteredRecords.length)];
        if (record && record.fields && record.fields['Name']) {
          const name = record.fields['Name'];
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
    populateCategoryDropdown();
    displayRandomRecord();    
  };


  
  // Add event listeners to the dropdown and submit button
document.getElementById('industry-dropdown').addEventListener('load', populateDropdown());

// document.getElementById('submit-button').addEventListener('click', displayRandomRecord);

// Add event listeners to the dropdown and submit button
// document.getElementById('industry-dropdown').addEventListener('change', displayRandomRecord);


// Add event listeners to the dropdown and submit button
document.getElementById('industry-dropdown').addEventListener('change', event => {
  populateCategoryDropdown();
  displayRandomRecord();
});
document.getElementById('submit-button').addEventListener('click', event => {
  event.preventDefault();
  displayRandomRecord();
});