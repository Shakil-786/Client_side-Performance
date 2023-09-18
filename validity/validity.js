let intervalId;
        document.getElementById('start').addEventListener('click', async () => {
            document.getElementById('timeInterval').style.visibility='visible'
            document.getElementById('stop').style.visibility='visible'
            document.getElementById('start').style.visibility='hidden'
        })
        const url = document.getElementById('urlInput3').value;
        function emailSend() {
            Email.send({
                Host: "smtp.elasticemail.com",
                Username: "annapurna.kg@nineleaps.com",
                Password: "06EE1C3FCDEAD71B36EC8D21812699DAA31D",
                To: 'annapurnanayak999@gmail.com',
                From: "annapurna.kg@nineleaps.com",
                Subject: "Mail regarding url",
                Body: "Website is down for now "
            }).then(
                message => document.getElementById('resultMessage').innerHTML = 'Link is Invalid. An Email has been sent to the admin.'
            );
        }
        //run the test once user click enter
        document.getElementById('urlInput3').addEventListener('keyup', (event) => {
        if (event.key === "Enter") {
            document.getElementById('checkButton').click();
        }
        });
        document.getElementById('checkButton').addEventListener('click', async () => {
            console.log("clicked")
            async function rerun() {
                const url = document.getElementById('urlInput3').value;
                const resultmessage=document.getElementById('resultMessage');
                console.log(url);
                if (!url ) {
                    alert('Please enter a URL');
                    return;
                }
                if (/^(?![A-Za-z]+$)[0-9\s!@#$%^&*()_+[\]{};:'",.<>?]*$|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b|^$/.test(url)) {
                    resultmessage.innerHTML = '<div class="alert alert-danger" role="alert">Invalid URL input. Please enter a valid URL.</div>';
                    // errorMessage.style.display = 'inline-block';
                    return;
                }
                if (/^[A-Za-z]+$/.test(url)) {
                    resultmessage.innerHTML = '<div class="alert alert-danger" role="alert">Invalid URL input. Please enter a valid URL.</div>';
                //   errorMessage.style.display = 'inline-block';;
                return;
              }
                const response = await fetch('http://localhost:3000/check_URL', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url })
                }); 
                console.log(response.status);
                if (response.status == 200 || response.status == 204) {
                    const textContent = "Link is valid"
                    document.getElementById('resultMessage').innerHTML = textContent;
                    document.getElementById('openUrlButton').style.visibility='visible';
                } else {
                    emailSend()
                    document.getElementById('openUrlButton').style.visibility='hidden';
                }
            }
            rerun()
            const time = document.getElementById('timeInterval').value
            if (time != "") {
                const timeInMiliSecond = time * 60 * 1000
                intervalId = setInterval(rerun, timeInMiliSecond)
            }
        });
        document.getElementById('stop').addEventListener('click', () => {
            clearInterval(intervalId)
            console.log('clicking on stopbutton');
            document.getElementById('stop').style.visibility='hidden'
            document.getElementById('timeInterval').style.visibility='hidden'
            document.getElementById('start').style.visibility='visible'
        })
        document.getElementById('openUrlButton').addEventListener('click', () => {
            const url = document.getElementById('urlInput3').value
            const fullUrl = url.startsWith('http') ? url : `http://${url}`;
            window.open(fullUrl)
            document.getElementById('openUrlButton').style.visibility='hidden';
        })
        const urlInputField=  document.getElementById('urlInput3')
        const outputDiv= document.getElementById('resultMessage')
        urlInputField.addEventListener('input', () => {
            // Hide other elements when the input changes
            outputDiv.innerHTML = '';
            document.getElementById('openUrlButton').style.visibility='hidden';
            document.getElementById('urlchecker').style.visibility='visible';
        });

        urlInputField.addEventListener('click', () => {
            
            document.getElementById('urlchecker').style.visibility='visible';
            this.removeAttribute('placeholder');

        });
        
        urlInputField.addEventListener('focus', function () {
            // Clear the placeholder attribute when the input gains focus
            this.removeAttribute('placeholder');
        });

        urlInputField.addEventListener('blur', function () {
            // Restore the placeholder attribute when the input loses focus
            this.setAttribute('placeholder', 'ENTER URL');
            document.getElementById('urlchecker').style.visibility='hidden';
        });
