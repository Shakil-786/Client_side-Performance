

document.addEventListener('DOMContentLoaded', () => {

  // DOM elements
  const runButton = document.getElementById('runButton');
  const textInput = document.getElementById('textInput');
  const openButton = document.getElementById('openButton');
  const loaderContainer = document.getElementById('loaderContainer');
  const errorMessage = document.getElementById('errorMessage');
  const fieldDiv = document.getElementById('field--div');
  const fields = document.getElementById('fields');
  const outputElement = document.getElementById('field-output');
  const downloadJson = document.getElementById('download--json')
  const dropDown = document.getElementById('dropdown')
  const outputDiv = document.getElementById('output--div')
  const table = document.getElementById('output')
  // Click event listener for the "Run" button
  runButton.addEventListener('click', async () => {
    const url = textInput.value;

    // Reset all elements and values related to previous search
    openButton.style.display = 'none';
    errorMessage.style.display = 'none';
    outputElement.style.display = 'none';
    table.style.display = 'none';
    downloadJson.style.display = 'none';
    fieldDiv.style.display = 'none';
    fields.value = 'none'; // Reset the dropdown to the default value
    if (url) {
      const response = await sendRequestToServer(url);
      const isSuccess = response?.ok || false;

      openButton.style.display = isSuccess ? 'inline-block' : 'none';
      errorMessage.style.display = isSuccess ? 'none' : 'inline-block';
      fieldDiv.style.display = isSuccess ? 'inline-block' : 'none';
      downloadJson.style.display = isSuccess ? 'inline-block' : 'none'
      dropDown.style.display = isSuccess ? 'inline-block' : 'none'
      outputDiv.style.display = isSuccess ? 'inline-block' : 'none'

      // Clear the previous table content
      outputElement.innerHTML = '';
      table.innerHTML='';
    }
  });

  // Change event listener for the "fields" select element
  fields.addEventListener('change', async () => {
    try {
      const response = await fetch('http://localhost:3000/jsondata-read');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const val = fields.value;

      if (val === "all") {

        const tableHTML = generateTable(data.categories);
        table.innerHTML = tableHTML;
        table.style.display = "block"
        outputElement.style.display="none"
      }
      else if (val === "none") {
        outputElement.style.display = "none"
        table.style.display = "none"
      }
      else {
        table.style.display = "none"
        outputElement.style.display = 'block'
        outputElement.innerHTML = val === "none" ? "output--table." : (Number.isInteger(data.categories[val].score * 100) ? (data.categories[val].score * 100) : (data.categories[val].score * 100).toFixed(1));

      }
    } catch (error) {
      console.error('Error fetching JSON:', error);
    }
  });

  function generateTable(categories) {

    let tableHTML = '<table class="table-primary "  id="output--table"> <thead><tr><th>Fields</th><th>Score</th></tr></thead><tbody>';
    const outputTable = document.getElementById('output--table')
    for (const option in categories) {
      const score = Number.isInteger(categories[option].score * 100) ? (categories[option].score * 100) : (categories[option].score * 100).toFixed(1);
      tableHTML += `<tr><td>${option}</td><td>${score}</td></tr>`;
    }

    tableHTML += '</tbody></table>';
    return tableHTML;

  }

  // Input event listener for the text input
  textInput.addEventListener('input', () => {
    openButton.style.display = 'none';
    errorMessage.style.display = 'none';
    outputElement.style.display = 'none';
    table.style.display = 'none';
    downloadJson.style.display = 'none';
    fieldDiv.style.display = 'none'
  });

  textInput.addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
      runButton.click();
      fields.value = 'none';

    }

  });

  // Click event listener for the "Open" button
  openButton.addEventListener('click', () => {
    window.open('../reports/report.report.html', '_blank');
  });

  // Click event listener for the "download Json" button
  downloadJson.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3000/download-report');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    }
    catch (error) {
      console.error('Error fetching JSON:', error);
    }

  })


  // Function to send a request to the server
  async function sendRequestToServer(url) {
    try {
      loaderContainer.style.display = 'block';
      const response = await fetch('http://localhost:3000/run-lighthouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        console.log('Lighthouse command sent to the server.');
      }

      return response;
    } catch (error) {
      console.error('Error:', error);
      return error;
    } finally {
      loaderContainer.style.display = 'none';
    }
  }

});
