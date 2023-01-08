const API_KEY = 'keymea83uBF3sXe4F';
const BASE_ID = 'appZ3GuJeBak8ThRv';
const TABLE_NAME = 'tblDPUarjm1VvaMj6';

const endpoint = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Function to populate the dropdown with the list of industries
async function populateDropdown() {
  document.getElementById('loader').style.display = 'block';
  try {
    const response = await axios.get(`${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    const industries = new Set();
    response.data.records.forEach(record => {
      industries.add(record.fields['Industry']);
    });
    const dropdown = document.getElementById('industry-dropdown');
    industries.forEach(industry => {
      const option = document.createElement('option');
      option.value = industry;
      option.innerHTML = industry;
      dropdown.appendChild(option);
    });
    document.getElementById('loader').style.display = 'none';
  } catch (error) {
    console.error(error);
    document.getElementById('loader').style.display = 'none';
  }
}


// Function to get a random record from the 'Name' column
async function getRandomRecord(selectedIndustry) {
  try {
    const response = await axios.get(`${endpoint}`, {
      params: {
        'filterByFormula': `{Industry}='${selectedIndustry}'`,
      },
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    const records = response.data.records;
    if (records.length === 0) {
      return 'No records found';
    }
    const recordIndex = Math.floor(Math.random() * records.length);
    return records[recordIndex].fields['Name'];
  } catch (error) {
    console.error(error);
  }
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
async function displayRandomRecord() {
  document.getElementById('loader').style.display = 'block';
  try {
    const selectedIndustry = document.getElementById('industry-dropdown').value;
    if (selectedIndustry === '') {
      return 'No industry selected';
    }
    const randomRecord = await getRandomRecord(selectedIndustry);
    document.getElementById('random-record').innerHTML = randomRecord ?? 'No record found';
    document.getElementById('loader').style.display = 'none';
  } catch (error) {
    console.error(error);
    document.getElementById('loader').style.display = 'none';
  }
}




  window.onload = function() {
    displayRandomRecord();
  };
  
  // Add event listeners to the dropdown and submit button
document.getElementById('industry-dropdown').addEventListener('load', populateDropdown());
// document.getElementById('submit-button').addEventListener('click', displayRandomRecord);

// Add event listeners to the dropdown and submit button
document.getElementById('industry-dropdown').addEventListener('change', displayRandomRecord);
// document.getElementById('submit-button').addEventListener('click', event => {  
//   document.getElementById('loader').style.display = 'block';
//   event.preventDefault();
//   displayRandomRecord();
//   document.getElementById('loader').style.display = 'none';
// });

document.getElementById('submit-button').addEventListener('click', displayRandomRecord);