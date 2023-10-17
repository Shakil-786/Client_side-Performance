import express, { json } from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import session from 'express-session';
// const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt'
const _json = bodyParser.json;
const urlencoded = bodyParser.urlencoded;
import http from 'http';
import fetch from 'node-fetch';
const secretKey = "Cleintsideperformance";
// const path = require('path')
const app = express();
const port = 3000;
app.use(json());
app.use(cors())
app.use(bodyParser.json());

//connecting the database
import UserModel from './models/user.model.js'
const mongoDB="mongodb://localhost:27017/client_side_performance"
mongoose.connect(mongoDB)

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




app.post("/signup", async (req, res) => {

  const { username, password, email } = req.body; //getting the response

  const username_upper=username.toUpperCase();
  const email_lower=email.toLowerCase();

  
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt); //encrypting the password
  
  UserModel.findOne({ $or:[{ name: username}, {email: email }]})
  .then((user) => {
    if(user){
    if (user.name===username_upper) {
      console.log('User found');
     
      return res.status(401).json({ error: "Username already exists" });
    }
    
    else if (user.email===email_lower) {
      console.log('User found');
     
      return res.status(401).json({ error: "email already exists" });
    }}
    
    else {
      console.log('User not found');

      // User with the given username does not exist.

      UserModel({
        name: username,
        email: email,
        password: hashedPassword
      }).save()
        .then(() => {
          console.log('User saved');
          // Send a success response to the frontend
          res.json({ message: "Signup successful" });
        })
        .catch((err) => {
          console.error(err);
          // Handle the error, such as sending an error response.
          res.status(500).json({ error: "Server error" });
        });
    }
  })
  .catch((err) => {
    console.error(err);
    // Handle the error, such as sending an error response.
    res.status(500).json({ error: "Server error" });
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
   try {
    // Find a user in the MongoDB collection based on the provided username
    const user = await UserModel.findOne({ name: username });

    // console.log(user);
    const envFilePath = 'storagefiles/user_email.json'
     const envFileContent = readFileSync(envFilePath, 'utf8');
    const updatedEnvFileContent = envFileContent.replace(
        /"user_email":\s*".*"/,
        `"user_email": "${user.email}"`
    );
   
     writeFileSync(envFilePath, updatedEnvFileContent);
     console.log(user.email);
    if (!user) {
      // User with the given username does not exist
      return res.status(401).json({ message: "User Do Not exist" });
    }

    // Compare the provided password with the hashed password stored in the user document
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Passwords match, generate a JWT token
      const token = jwt.sign({ userId: user.id, name: user.name }, secretKey, {
        expiresIn: "1h",
      });

      // Send the token as a JSON response
      return res.json({ token });
    } else {
      // Passwords do not match
      return res.status(400).json({ message: "Password is wrong" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }


});


app.get("/protected", verifyToken, (req, res) => {

  return res.json({ message: "You have access to this protected route" });
});

function verifyToken(req, res, next) {
  const token = req.headers["authorization"].replace("Bearer ", "");
  console.log(token);
  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    console.log("verified token");
    req.user = decoded;
    next();
  });
}




app.post("/update", async(req,res)=>{

   const { email, password} = req.body; //getting the response

  console.log(email);
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
    console.log("data receive");
  UserModel.findOneAndUpdate({ email: email }, { password:hashedPassword }, { new: true })
  .then(data=>{
  if (data) {
    console.log('Document updated:', data);
    return res.status(200).json({message: "Password Updated"})
    
  } else {
    console.log("user do not exist");
     return res.status(401).json({ message: "User Do Not exist" });
  }
});


})


app.use(session({
  secret: secretKey, // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
}));


app.post('/logout', (req, res) => {
  //clearing the emails
    const envFilePath = 'storagefiles/user_email.json'
     const envFileContent = readFileSync(envFilePath, 'utf8');
    const updatedEnvFileContent = envFileContent.replace(
        /"user_email":\s*".*"/,
        `"user_email": " "`
    );
   
     writeFileSync(envFilePath, updatedEnvFileContent);
  // Clear session data (e.g., user token, user data)

  req.session.destroy((err) => {
    console.log('logout is being called');
    if (err) {
      console.error('Error while logging out:', err);
    }

    // Redirect to the login or "logged out" page
    res.redirect("http://127.0.0.1:5501/loginPage/login.html"); // Replace with your desired redirection path
    
  });
});


app.get('/email-read', (req, res) => {
    readFile('storagefiles/user_email.json', 'utf8', (err, data) => {
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





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});











