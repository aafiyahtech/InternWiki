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
  
// // Function to display a random record from the 'Name' column
// function displayRandomRecord() {
//     const selectedIndustry = document.getElementById('industry-dropdown').value;
//     document.getElementById('loader').style.display = 'block';
//     axios.get(endpoint, {
//       headers: {
//         'Authorization': `Bearer ${API_KEY}`
//       }
//     }).then(response => {
//         document.getElementById('loader').style.display = 'none';
//       const records = response.data.records;
//       if (records) {
//         const filteredRecords = records.filter(record => {
//           return record && record.fields && record.fields['Industry'] === selectedIndustry;
//         });
//         if (filteredRecords.length > 0) {
//           const record = filteredRecords[Math.floor(Math.random() * filteredRecords.length)];
          
//           if (record && record.fields && record.fields['Name']) {
//             const name = record.fields['Name'];
//             console.log(name);
//             const container = document.getElementById('record-container');
//             if (container) {
//               container.innerHTML = name;
              
//             }
//           }
//         }
//       }
//     }).catch(error => {
//       console.error(error);
//     });
//   }


// Function to display a random record from the 'Name' column
function displayRandomRecord() {
  const selectedIndustry = document.getElementById('industry-dropdown').value;
  const getRecords = (offset) => {
    axios.get(`${endpoint}?offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    }).then(response => {
      const records = response.data.records;
      if (records) {
        const industryRecords = records.filter(record => record.fields['Industry'] === selectedIndustry);
        if (industryRecords.length > 0) {
          const record = industryRecords[Math.floor(Math.random() * industryRecords.length)];
          document.getElementById('name').innerHTML = record.fields['Name'];
          document.getElementById('upvotes').innerHTML = `Upvotes: ${record.fields['Upvotes']}`;
          document.getElementById('upvote-button').addEventListener('click', event => {
            document.getElementById('loader').style.display = 'block';
            axios.patch(`${endpoint}/${record.id}`, {
              fields: {
                'Upvotes': record.fields['Upvotes'] + 1
              }
            }, {
              headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              }
            }).then(response => {
              document.getElementById('upvotes').innerHTML = `Upvotes: ${response.data.fields['Upvotes']}`;
              document.getElementById('upvote-count').innerHTML = `Total Upvotes: ${response.data.fields['Upvotes']}`;
              document.getElementById('loader').style.display = 'none';
            }).catch(error => {
              console.error(error);
              document.getElementById('loader').style.display = 'none';
            });
          });
          document.getElementById('downvote-button').addEventListener('click', event => {
            document.getElementById('loader').style.display = 'block';
            axios.patch(`${endpoint}/${record.id}`, {
              fields: {
                'Upvotes': record.fields['Upvotes'] - 1
              }
            }, {
              headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
              }
            }).then(response => {
              document.getElementById('upvotes').innerHTML = `Upvotes: ${response.data.fields['Upvotes']}`;
              document.getElementById('upvote-count').innerHTML = `Total Upvotes: ${response.data.fields['Upvotes']}`;
              document.getElementById('loader').style.display = 'none';
            }).catch(error => {
              console.error(error);
              document.getElementById('loader').style.display = 'none';
            });
          });
        } else {
          document.getElementById('name').innerHTML = 'No records found';
          document.getElementById('upvotes').innerHTML = '';
        }
      }
    }).catch(error => {
      console.error(error);
    });
  };
  getRecords(0);
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