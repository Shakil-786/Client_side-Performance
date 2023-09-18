import xpath from 'cypress-xpath'
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
describe('visit site', () => {
  before(function () {
    cy.fixture('example').then(function (data) {
      globalThis.data = data
    })
    cy.fixture('example1').then(function (data) {
      globalThis.data1 = data
    })
  })
  it(' security', () => {
    const baseurl = data.CYPRESS_BASE_URL
    // const baseurl ='https://pda-stage.socion.io/new/iam/login'
    const terms = data1.TERMS
    for (let i = 0; i < terms.length; i++) {
      terms[i] = `${terms[i]}`;
    }
    cy.log(terms)
    cy.visit(baseurl)
    // cy.xpath("//*[@class='css-901oao'][1]").click()
    // cy.xpath("//div[text()='India']").click()
    // cy.get('input[type="text"]').type('')
    // cy.get('input[type="password"]').type('')
    // cy.xpath("(//div[text()='Login'])[2]").click()
    cy.window().then((win) => {
      let param = []
      let valuesToCheck = [ 'email', 'cardDetails','password','phoneNumber'];
      valuesToCheck.push(...terms);
      cy.log(valuesToCheck)
      for (let i = 0; i < win.localStorage.length; i++) {
        const key = win.localStorage.key(i);
        const value = win.localStorage.getItem(key);
        // const valuesToCheck = terms;

        
        for (let i = 0; i < valuesToCheck.length; i++) {
          if (value.includes(valuesToCheck[i]) || key.includes(valuesToCheck[i])) {
            if (!param.includes(valuesToCheck[i])) {
              param.push(valuesToCheck[i]);
            }
          }
        }
        
        // cy.log(param)
        if (i === 0) {
          cy.request({
            method: 'POST',
            url: 'http://localhost:3000/localStorage-data',
            body: win.localStorage
          }).then(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.equal('Data received successfully');
          });
        }
      }
      for (let i = 0; i < win.sessionStorage.length; i++) {
        const key = win.sessionStorage.key(i);
        const value = win.sessionStorage.getItem(key);
        // const valuesToCheck = [ 'email', 'cardDetails','password','phoneNumber'];
        // const valuesToCheck = terms
        // cy.log(valuesToCheck)
        for (let i = 0; i < valuesToCheck.length; i++) {
          if (value.includes(valuesToCheck[i])||key.includes(valuesToCheck[i])) {
            // cy.log("inside loop")
            if (!param.includes(valuesToCheck[i])) {
              param.push(valuesToCheck[i]);
            }
          }
        }
        if (i === 0) {
          cy.request({
            method: 'POST',
            url: 'http://localhost:3000/sessionStorage-data',
            body: win.sessionStorage
          }).then(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.equal('Data received successfully');
          });
        }
      }
      valuesToCheck = valuesToCheck.filter(item => !terms.includes(item));
      cy.log(valuesToCheck)
      const data = {
        intValue: param
      };
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/outPut',
        body: data
      }).then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.equal('Data received successfully');
      })
    })
  });
})