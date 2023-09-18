

document.addEventListener('DOMContentLoaded', () => {

  // DOM elements
  const runButton = document.getElementById('runButton1');
  const textInput = document.getElementById('textInput');
  const openButton = document.getElementById('openButton');
  const iframe = document.getElementById('iframe');
  const loaderContainer = document.getElementById('loader-Container');
  const errorMessage = document.getElementById('errorMessage');
  const fieldDiv = document.getElementById('field--div');
  const fields = document.getElementById('fields');
  const outputElement = document.getElementById('field-output');
  const downloadJson = document.getElementById('download--json')
  const dropDown = document.getElementById('dropdown')
  const table = document.getElementById('output')
  const btnGroup = document.querySelector('.btn-group')
  const section2 = document.querySelector('.section2')
  // Click event listener for the "Run" button

  fieldDiv.style.visibility = 'hidden'
  table.style.visibility = 'hidden';
  btnGroup.style.visibility='hidden'
  iframe.style.visibility='hidden'
  section2.style.display = 'none'

  runButton.addEventListener('click', async () => {
    const url = textInput.value;

    // Reset all elements and values related to previous search
    errorMessage.style.display = 'none';
    table.style.visibility = 'hidden';
    btnGroup.style.visibility='hidden'

    fields.value = 'none'; // Reset the dropdown to the default value
    if (!url ) {
      alert('Please enter a URL');
      return;
  }
    if (url) {
      if (/^(?![A-Za-z]+$)[0-9\s!@#$%^&*()_+[\]{};:'",.<>?]*$|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b|^$/.test(url)) {
        errorMessage.innerHTML = '<div class="alert alert-danger" style="min-width: 400px;" role="alert">Invalid URL input. Please enter a valid URL.</div>';
        errorMessage.style.display = 'inline-block';
        loaderContainer.style.visibility='hidden'
    }
    if (/^[A-Za-z]+$/.test(url)) {
      errorMessage.innerHTML = '<div class="alert alert-danger" style="min-width: 400px;" role="alert">Invalid URL input. Please enter a valid URL.</div>';
      errorMessage.style.display = 'inline-block';
  }
    
      else{
        const response = await sendRequestToServer(url);
        const isSuccess = response?.ok || false;
        // console.log(response.status)
        // if(response.status===500){
        //   errorMessage.style.display = 'block'
        // }
        
        btnGroup.style.visibility = isSuccess ? 'visible' : 'hidden';
        errorMessage.style.display = isSuccess ? 'none' : 'inline-block';
        fieldDiv.style.visibility = isSuccess ? 'visible' : 'hidden';
        dropDown.style.visibility = isSuccess ? 'visible' : 'hidden'
        section2.style.display = isSuccess ? 'block' : 'none'
        // Clear the previous table content
        outputElement.innerHTML = '';
        table.innerHTML='';
        outputElement.style.visibility="hidden"
        loadDynamicPage();
      }
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
        table.style.visibility = "visible"
        outputElement.style.display="none"
      }
      else if (val === "none") {
        outputElement.style.visibility = "hidden"
        table.style.visibility = "hidden"
        outputElement.style.visibility = "hidden"
      }
      else {
        table.style.visibility = "hidden"
        outputElement.style.display="block"
        outputElement.style.visibility = "visible"
        outputElement.innerHTML = val === "none" ? "output--table." : `Your score : ${(Number.isInteger(data.categories[val].score * 100) ? (data.categories[val].score * 100) : (data.categories[val].score * 100).toFixed(1))} `;

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
    btnGroup.style.visibility = "hidden"
    errorMessage.style.display = 'none';
    section2.style.display = 'none';
    table.style.visibility = 'hidden';
    fieldDiv.style.visibility = 'hidden'
    iframe.style.visibility = 'hidden'
  });

  textInput.addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
      runButton.click();
      fields.value = 'none';

    }
  });

  // Click event listener for the "Open" button
  openButton.addEventListener('click', () => {
    iframe.style.visibility="visible"
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
     console.log(response)
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


function loadDynamicPage() {
  // Generate a random query parameter to force the browser to reload the iframe
  const randomQueryParam = Math.random();
  // Get a reference to the iframe element
  const iframe = document.getElementById("iframe");
  // Set the src attribute of the iframe with the random query parameter
  iframe.src = "../reports/reports.report.html?random=" + randomQueryParam;
}