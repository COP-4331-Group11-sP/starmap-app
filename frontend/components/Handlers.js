import { saveCookie } from './cookieHandler';

//TO-DO: REDIRECT TO MAIN PAGE BY USING LOGIN FETCH
//TO-DO: ERROR HANDLING
async function registrationFetch(user, pass, conf, email){
  
  let errorMessage = 0;
  console.log(user, pass, conf, email);
  
  let emailCheck = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  let userCheck = /\w+/i;
  let passCheck = /\w+/i;
  let confCheck = /\w+/i;
  /*
  if (!emailCheck.test(email) || !userCheck.test(user) || !passCheck.test(pass) || confCheck.test(conf)) {
    console.log('One or more fields are incorrect.');
    errorMessage = 4;
    return;
  }
  */
  if(pass.length < 8)
  {
    console.log('Passwords cannot be less than 8 characters!');
    errorMessage = 1;
    return errorMessage;
  }
  else if (pass != conf)
  {
    console.log('Passwords do not match!');
    errorMessage = 2;
    return errorMessage;
  }

  var jsonPayload = {
      username: user,
      password: pass,
      email: email,
  };

  let response = await fetch(global.baseURL + '/api/signup',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonPayload)
  });
    
  console.log(response.status);
  let data = await response.json();
  if (response.status < 200 || response.status >= 300) {
    const error = (data && data.message) || response.status;
    if (response.status >= 400 && response.status < 500) {
      console.log("Invalid object was passed to API, please try again.")
      errorMessage = 4;
      return errorMessage;
    } else if (response.status >= 500 && response.status < 600) {
      console.log("Internal server error. Please try again later.")
      errorMessage = 5;
      return errorMessage;
    }
    return error;
  }

  console.log("Succesful registration.");
  global.userId = data._id;
  saveCookie(global.userId);
  verifyEmailFetch(email);
  return 0;
}

//TO-DO: REDIRECT TO MAIN PAGE
function loginFetch(user, pass ){

  let errorMessage = 0;
  console.log(user, pass);

  var checkPass = pass.includes(" ");
  
  //CHECK IF PASSWORD CONFIRM IS EQUAL TO PASSWORD
  if( (pass.length) < 8)
  {
    console.log('Passwords cannot be less than 8 characters!');
    errorMessage = 1;
    return errorMessage;
    
  }
  else{
    var jsonPayload = {
        username: user,
        password: pass,
      }

  fetch(global.baseURL + '/api/login',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonPayload)})
        .then(async response => {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const data = isJson && await response.json();
          
          console.log(response.status);

          // check for error response
          if (!response.ok) {
              // get error message from body or default to response status
              const error = (data && data.message) || response.status;

              switch(response.status)
              {
                case 400:
                  {
                    console.log("Invalid object was passed to API, please try again.")
                    errorMessage = 2;
                    return errorMessage;
                  }
                case 401: 
                {
                    console.log("User does not exist.")
                    errorMessage = 3;
                    return errorMessage;
                }
                case 402:
                {
                    console.log("Wrong username and password combination.")
                    errorMessage = 4;
                    return errorMessage;
                }
                case 500:
                  {
                    console.log("Internal server error. Please try again later.")
                    errorMessage = 5;
                    return errorMessage;
                  }
              }
              return Promise.reject(error);
          }
          else
          {
            console.log(data);
            global.userId = data.signIn._id;
            saveCookie(global.userId);
            return 0;
          }
      })
      .catch(error => {
          // this.setState({ errorMessage: error.toString() });
          console.error('There was an error!', error);
      });
    
  }
}

//TO-DO: FIGURE OUT HOW TO REDIRECT SOMEONE FROM EMAIL BACK INTO THE WEBSITE....
function forgotPassFetch(email){
  
  let errorMessage = 0;
  console.log(email);

  var checkEmailAt = email.includes("@");
  var checkEmailPeriod = email.includes(".");
  if((checkEmailAt) == false || (checkEmailPeriod) == false)
  {
    console.log('Emails cannot be missing an @ or a . symbol. ');
    errorMessage = 1;
    return errorMessage;
  }
  else{
  
    var jsonPayload = {
        email: email,
      }

  fetch(global.baseURL + '/api/reset-password',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonPayload)})
        .then(async response => {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const data = isJson && await response.json();
          
          console.log(response.status);

          // check for error response
          if (!response.ok) {
              // get error message from body or default to response status
              const error = (data && data.message) || response.status;

              switch(response.status)
              {
                case 400:
                  {
                    console.log("Invalid object was passed to API, please try again.")
                    break;
                  }
                case 401: 
                {
                  console.log("User does not exist.")
                    break;
                }
                case 402:
                {
                    console.log("User does not exist.")
                    break;
                }
                case 500:
                  {
                    console.log("Internal server error. Please try again later.")
                    break;
                  }
              }
              return Promise.reject(error);
          }

          console.log("SUCCESSFUL PASS!");
          errorMessage = 0;
          return errorMessage;
            
      })
      .catch(error => {
          console.error('There was an error!', error);
      });
    
  }
}

//TO-DO: ERROR HANDLING
//TO-DO: SEND SOMEONE BACK TO THE MAP
function newPassFetch(pass, conf, idToken, pwToken){

  let errorMessage = 0;
  console.log(pass, conf);

  //var checkPass = pass.includes(" ");
  
  //CHECK IF PASSWORD CONFIRM IS EQUAL TO PASSWORD
  if( (pass.length) < 8)
  {
    console.log('Passwords cannot be less than 8 characters!');
    
  }
  else if ((pass) != (conf))
  {
    console.log('Passwords do not match!');
  }
  else{
  
    var jsonPayload = {
        password: pass,
        idToken: idToken,
        pwToken: pwToken
      };

  fetch(global.baseURL + '/api/reset',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonPayload)})
        .then(async response => {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const data = isJson && await response.json();
          
          console.log(response.status);

          // check for error response
          if (!response.ok) {
              // get error message from body or default to response status
              const error = (data && data.message) || response.status;

              switch(response.status)
              {
                case 400:
                  {
                    console.log("Invalid object was passed to API, please try again.")
                    break;
                  }
                case 401: 
                {
                  console.log("User does not exist.")
                    break;
                }
                case 402:
                {
                    console.log("User does not exist.")
                    break;
                }
                case 500:
                  {
                    console.log("Internal server error. Please try again later.")
                    break;
                  }
              }
              return Promise.reject(error);
          }
          else
          console.log("SUCCESSFUL PASS UPDATE!")
          return 0;
      })
      .catch(error => {
          // this.setState({ errorMessage: error.toString() });
          console.error('There was an error!', error);
      });
    
  }

}

async function verifyEmailFetch(email){
  
  let errorMessage = 0;
  console.log(email);

  let emailCheck = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  
  if(!emailCheck.test(email))
  {
    console.log('Emails cannot be missing an @ or a . symbol. ');
    errorMessage = 1;
    return errorMessage;
  }

  var jsonPayload = {
      email: email
  };

  let response = await fetch(global.baseURL + '/api/verify-email',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonPayload)
  });

  console.log(response.status);

  if (response.status < 200 || response.status >= 300) {
    const error = (data && data.message) || response.status;
    if (response.status >= 400 && response.status < 500) {
      console.log("Invalid object was passed to API, please try again.")
      errorMessage = 4;
      return errorMessage;
    } else if (response.status >= 500 && response.status < 600) {
      console.log("Internal server error. Please try again later.")
      errorMessage = 5;
      return errorMessage;
    }
    return Promise.reject(error);
  }

  console.log("Verification email sent!");
  return 0;
}

async function verifyFetch(verificationToken) {

  let jsonPayload = {
    verificationToken: verificationToken
  };

  let response = await fetch(global.baseURL + '/api/verify', 
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonPayload)
  });

  console.log('attempted to fetch from /api/verify/');

  if (response.status < 200 || response.status >= 300) {
    if (response.status >= 400 && response.status < 500) {
      console.log("Invalid object was passed to API, please try again.")
      errorMessage = 4;
      return errorMessage;
    } else if (response.status >= 500 && response.status < 600) {
      console.log("Internal server error. Please try again later.")
      errorMessage = 5;
      return errorMessage;
    }
    return Promise.reject(error);
  }

  return 0;
}

export {registrationFetch, loginFetch, forgotPassFetch, newPassFetch, verifyFetch, verifyEmailFetch};