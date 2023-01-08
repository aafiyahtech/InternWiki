// Replace YOUR_API_KEY with your Airtable API key
const API_KEY = "keymea83uBF3sXe4F";

// Replace YOUR_BASE_ID with your Airtable base ID
const BASE_ID = "appZ3GuJeBak8ThRv";

// Replace YOUR_TABLE_NAME with the name of your table in Airtable
const TABLE_NAME = "tblDPUarjm1VvaMj6";
// const TABLE_NAME = "Intern Tasks"; 

// Set up a form submission event listener
document.getElementById("form").addEventListener("submit", event => {
  event.preventDefault(); // Prevent the form from refreshing the page
  
  // Get the selected industry and category from the form
  const industry = document.getElementById("industry").value;
  const category = document.getElementById("category").value;
  
  // Build the Airtable API URL
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
  
// Function to retrieve a list of distinct values for a given field
function getDistinctValues(field, value) {

    // Set up the request options
    const ddOptions = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${API_KEY}`
        }
    };

    // Send the request to the Airtable API
    return fetch(url, ddOptions)
    .then(response => response.json())
    .then(data => {
    
        // Extract the distinct values from the returned records
        const values = data.records.map(record => record.fields[field]);
        return [...new Set(values)]; // Remove duplicates
    });
    }
    
    // Populate the industry dropdown with the distinct values
    getDistinctValues("Industry").then(industries => {
    const industryDropdown = document.getElementById("industry");
    industryDropdown.innerHTML = "<option value=''>(Select an industry)</option>";
    for (const industry of industries) {
      industryDropdown.innerHTML += `<option value='${industry}'>${industry}</option>`;
    }
     });

    // Set up an event listener for the industry dropdown
    document.getElementById("industry").addEventListener("change", event => {
    // Retrieve the selected industry value
    const industry = event.target.value;
    
    // Retrieve the records that match the selected industry value
    getDistinctValues("Industry", industry).then(records => {

        if (records && records.length > 0) {
      // Extract the categories from the returned records
      const categories = records.map(record => record.fields["Category"]);
      
      // Populate the category dropdown with the retrieved categories
      const categoryDropdown = document.getElementById("category");
      categoryDropdown.innerHTML = "<option value=''>(Select a category)</option>";
      for (const category of categories) {
        categoryDropdown.innerHTML += `<option value='${category}'>${category}</option>`;
      }
    }
    });
  });

    

  // Set up the request payload
  let payload = {
    fields: {}
  };
  
  // Add the industry and category to the payload if they are selected
  if (industry) {
    payload.fields.Industry = industry;
  }
  if (category) {
    payload.fields.Category = category;
  }
  
  // Set up the request options
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };
  
  // Send the request to the Airtable API
  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      // Get a random record from the returned list of records
      const record = data.records[Math.floor(Math.random() * data.records.length)];
      
      // Display the task name in the task div
      document.getElementById("task").innerHTML = record.fields.Name;
    });
});