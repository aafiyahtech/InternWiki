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


// Function to get a random record from the 'Name' column
function getRandomRecord(selectedIndustry) {
  return new Promise((resolve, reject) => {
    axios.get(`${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    }).then(response => {
      const records = response.data.records;
      if (records) {
        const industryRecords = records.filter(record => record.fields['Industry'] === selectedIndustry);
        if (industryRecords.length > 0) {
          resolve(industryRecords[Math.floor(Math.random() * industryRecords.length)]);
        } else {
          reject(new Error('No records found'));
        }
      } else {
        reject(new Error('No records found'));
      }
    }).catch(error => {
      reject(error);
    });
  });
}


// Function to update the 'Upvotes' field in Airtable
function updateUpvotes(record, value) {
  return axios.patch(`${endpoint}/${record.id}`, {
    fields: {
      'Upvotes': value
    }
  }, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
}

// Function to display the current upvote count
function displayUpvoteCount(upvotes) {
  document.getElementById('upvotes').innerHTML = `Upvotes: ${upvotes}`;
  document.getElementById('upvote-count').innerHTML = `Total Upvotes: ${upvotes}`;
}

// Function to handle the upvote button click event
function handleUpvoteClick(record) {
  document.getElementById('loader').style.display = 'block';
  updateUpvotes(record, record.fields['Upvotes'] + 1).then(response => {
    displayUpvoteCount(response.data.fields['Upvotes']);
    document.getElementById('loader').style.display = 'none';
  }).catch(error => {
    console.error(error);
    document.getElementById('loader').style.display = 'none';
  });
}

// Function to handle the downvote button click event
function handleDownvoteClick(record) {
  document.getElementById('loader').style.display = 'block';
  updateUpvotes(record, record.fields['Upvotes'] - 1).then(response => {
    displayUpvoteCount(response.data.fields['Upvotes']);
    document.getElementById('loader').style.display = 'none';
  }).catch(error => {
    console.error(error);
    document.getElementById('loader').style.display = 'none';
  });
}


// Function to display a random record from the 'Name' column
function displayRandomRecord() {
  document.getElementById('loader').style.display = 'block';
  const selectedIndustry = document.getElementById('industry-dropdown').value;
  getRandomRecord(selectedIndustry).then(record => {
    document.getElementById('name').innerHTML = record.fields['Name'];
    displayUpvoteCount(record.fields['Upvotes']);
    document.getElementById('upvote-button').addEventListener('click', event => {
      handleUpvoteClick(record);
    });
    document.getElementById('downvote-button').addEventListener('click', event => {
      handleDownvoteClick(record);
    });
    document.getElementById('loader').style.display = 'none';
  }).catch(error => {
    console.error(error);
    document.getElementById('loader').style.display = 'none';
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
  document.getElementById('loader').style.display = 'block';
  event.preventDefault();
  displayRandomRecord();
  document.getElementById('loader').style.display = 'none';
});