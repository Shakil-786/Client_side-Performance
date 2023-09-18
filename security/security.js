document.getElementById('urlInput2').addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
        document.getElementById('runButton').click();
    }
    });
    document.getElementById('runButton').addEventListener('click', async () => {
    const urlInputField = document.getElementById('urlInput2');
    const urlInput = document.getElementById('urlInput2').value.trim(); // Trim to remove leading/trailing spaces
    const terms = document.getElementById('requirements').value;
    const outputDiv = document.getElementById('output-sec');
    const checkButton = document.getElementById('runButton');
    const customSearchButton = document.getElementById('search');
    const loaderContainer2 = document.getElementById("loader-Container2")

    loaderContainer2.style.display = 'block'
    urlInputField.addEventListener('input', () => {
    // Hide other elements when the input changes
    outputDiv.innerHTML = '';
   });
   if (!urlInput ) {
    alert('Please enter a URL');
    loaderContainer2.style.display = 'none'
    return;
}

if (/^[A-Za-z]*$/.test(urlInput)) {
    loaderContainer2.style.display = 'none'
// Display an error message when the URL input is invalid
outputDiv.innerHTML = '<div class="alert alert-danger" role="alert">Invalid URL input. Please enter a valid URL.</div>';
return;
}
    if (!isValidUrlInput(urlInput)) {
        
        loaderContainer2.style.display = 'none'
        // Display an error message when the URL input is invalid
        outputDiv.innerHTML = '<div class="alert alert-danger" role="alert">Invalid URL input. Please enter a valid URL.</div>';
        return;
    } else {
        // Valid URL input, proceed with the request
        const response = await fetch('http://localhost:3000/run-cypress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: urlInput, terms })
        });
   document.getElementById('requirements').style.display = 'none';
        document.getElementById('search').style.display = 'none';
        if (response?.ok) {
            loaderContainer2.style.display = 'none'
            outputDiv.innerHTML = '';
            document.getElementById('seeResults').style.display = 'block';
        }
        else{
            loaderContainer2.style.display = 'none'
            outputDiv.innerHTML = '<div class="alert alert-danger" role="alert">Invalid URL input. Please enter a valid URL.</div>';
            return;
        }
    }
    function isValidUrlInput(input) {
        // Regular expression to check if the input contains only spaces, numbers, or special characters
        const regex =/^(?![A-Za-z]+$)[0-9\s!@#$%^&*()_+[\]{};:'",.<>?]*$|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b|^$/

        return !regex.test(input);
    }
    let fileSizeKB,fileSizeKB1
        try {
            const response = await fetch('http://localhost:3000/localStorage-data-read');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const fileSizeBytes = blob.size;
             fileSizeKB = fileSizeBytes / 1024;
            }
            catch (error) {
                console.error('Error fetching JSON:', error);
            }
        try {
            const response = await fetch('http://localhost:3000/sessionStorage-data-read');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const fileSizeBytes = blob.size;
             fileSizeKB1 = fileSizeBytes / 1024;
             console.log(fileSizeKB1);
            }
            catch (error) {
                console.error('Error fetching JSON:', error);
            }
        try {
            const response = await fetch('http://localhost:3000/output-read');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const value = data.intValue;
            const upperCaseArray = value.map(item => item.toLowerCase());
            const combinedText = upperCaseArray.join(',')
            if (value.length > 0) {
                const text = ('The website is not secure.It contains ' + combinedText +'.' )

                // console.log('');
                document.getElementById('output-sec').append(text)
                
            }
            else {
                const text = 'Website is secure.\n'
                document.getElementById('output-sec').append(text)
            }
        } catch (error) {
            console.error('Error fetching JSON:', error);
        }
        const text=("          Maximum limit of Local storage is 10 MB and your storage contains " + fileSizeKB.toFixed(2) + " KB. ")
            document.getElementById('output-sec').append(text)
            console.log(text);
        const text1=("         Maximum limit of Session storage is 10 MB and your storage contains " + fileSizeKB1.toFixed(2) + " KB. ")
            document.getElementById('output-sec').append(text1)
            console.log(text1);
        document.getElementById('seeResults').style.display = 'none'
        document.getElementById('search').style.display='block'
        // document.getElementById('search').style.visibility='visible'

    });
    document.getElementById('search').addEventListener('click',async () =>{
        document.getElementById('requirements').style.display='block'
        document.getElementById('search').style.display='none'
    })

    