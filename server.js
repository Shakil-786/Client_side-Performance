import express, { json } from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import bodyParser from 'body-parser';
const _json = bodyParser.json;
const urlencoded = bodyParser.urlencoded;
import http from 'http';
import fetch from 'node-fetch';

// const path = require('path')
const app = express();
const port = 3000;
app.use(json());
app.use(cors())

app.use(_json()); // Parse JSON body
app.use(urlencoded({ extended: true }));
app.get('/', (req, res) => {
    return res.send('Home')
})
import { readFile, writeFile, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

app.post('/run-lighthouse', (req,res) => {

  const url = req.body.url;
  const fullUrl =/^(https?:\/\/)/.test(url) ? url : `https://${url}`;
  const parsedUrl = new URL(fullUrl);
  const command = `lighthouse ${parsedUrl} --quiet --chrome-flags="--headless" --output=html,json --output-path=./reports/reports`;
  let respo = res;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Error executing Lighthouse command.');
      return;
    }
    console.log('Lighthouse command executed successfully:', stdout);
    res.status(200).send('Lighthouse command executed successfully.');
    
  });
});

app.get('/download-report', (req, res) => {

  const sourceFilePath = './reports/reports.report.json';
  const destinationFolderPath = 'C:/Users/nineleaps/Downloads';//give your local download path
  const fileName = basename(sourceFilePath);
const destinationFilePath = join(destinationFolderPath, fileName);
  readFile(sourceFilePath, (err, data) => {
if (err) {
  console.error('Error reading source file:', err);
  return;
}

// Write the content to the destination file
  writeFile(destinationFilePath, data, (err) => {
  if (err) {
    console.error('Error writing destination file:', err);
  } else {
    console.log('File copied successfully!');
  }
});
});
});


app.get('/jsondata-read', (req, res) => {
  readFile('./reports/reports.report.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading JSON file:', err);
          res.status(500).json({ error: 'Error reading JSON file' });
          return;
      }
      try {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
      } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          res.status(500).json({ error: 'Error parsing JSON' });
      }
  });
});

app.post('/run-cypress', (req, res) => {
    const url = req.body.url;
    console.log(url)
    const envFilePath = 'cypress/fixtures/example.json'
    const envFileContent = readFileSync(envFilePath, 'utf8');
    const updatedEnvFileContent = envFileContent.replace(
        /"CYPRESS_BASE_URL":\s*".*"/,
        `"CYPRESS_BASE_URL": "${url}"`
    );
   
    const terms = req.body.terms
const valuesToCheck = terms.split(',');
// console.log(valuesToCheck)
const envFilePath1 = 'cypress/fixtures/example1.json';
const envFileContent1 = readFileSync(envFilePath1, 'utf8');
const parsedEnvFileContent1 = JSON.parse(envFileContent1);

parsedEnvFileContent1["TERMS"] = valuesToCheck;

const updatedEnvFileContent1 = JSON.stringify(parsedEnvFileContent1, null, 2);

  writeFileSync(envFilePath1, updatedEnvFileContent1, 'utf8');

console.log('File updated successfully.');


    writeFileSync(envFilePath, updatedEnvFileContent);

    const cypressCommand = `npx cypress run`;
    
    exec(cypressCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('Cypress execution error:', error);
            return res.status(500).send('Cypress execution failed');
        }
     
        writeFileSync(envFilePath, envFileContent);
   
        const output = stdout.toString() + stderr.toString();
        res.json({output});
       
    });
    });

    app.post('/localStorage-data', (req, res) => {
  const localData = JSON.stringify(req.body);
      // res.send(localData)
      writeFile('storagefiles/localStorage.json', localData,
err => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('File has been written successfully.');
  }
});
 
  res.status(200).send('Data received successfully');

});

   app.post('/sessionStorage-data', (req, res) => {
  const sessionData = JSON.stringify(req.body);

     writeFile('storagefiles/sessionStorage.json', sessionData,
err => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('File has been written successfully.');
  }
});

  res.status(200).send('Data received successfully');
});

 app.post('/outPut', (req, res) => {
  const output = JSON.stringify(req.body);

   writeFile('storagefiles/output.txt', output,
err => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('File has been written successfully.');
  }
});
  res.status(200).send('Data received successfully');
});
app.get('/localStorage-data-read', (req, res) => {
    readFile('storagefiles/localStorage.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({ error: 'Error reading JSON file' });
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error parsing JSON' });
        }
    });
    
});
app.get('/sessionStorage-data-read', (req, res) => {
    readFile('storagefiles/sessionStorage.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({ error: 'Error reading JSON file' });
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error parsing JSON' });
        }
    });
});
app.get('/output-read', (req, res) => {
    readFile('storagefiles/output.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({ error: 'Error reading JSON file' });
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error parsing JSON' });
        }
    });
});

app.post('/check_URL', async (req, res) => {
  const url = req.body.url;
  if (!url) {
    res.status(400).json({ error: 'URL is required.' });
    return;
  }
  try {
    const fullUrl = /^(https?:\/\/)/.test(url) ? url : `https://${url}`;
    const parsedUrl = new URL(fullUrl);
    const response = await fetch(parsedUrl, { method: 'HEAD' });
    // if (response.ok) {
    //   res.status(200).send('found')
    // } else {
    //   res.status(404).send('Not found')
    // }
    res.status(response.status).send('Found')
  }
  catch (error) {
    res.status(500).send(error)
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});











