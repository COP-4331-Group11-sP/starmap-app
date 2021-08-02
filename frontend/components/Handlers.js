
  global.userID = 0;

  //TO-DO: REDIRECT TO MAIN PAGE BY USING LOGIN FETCH
  //TO-DO: ERROR HANDLING
  function registrationFetch(user, pass, conf, email){
    
    let errorMessage = 0;
    console.log(user, pass, conf, email);

    var checkEmailAt = email.includes("@");
    var checkEmailPeriod = email.includes(".");
    // var checkPass = pass.includes('');
    // var checkUser = user.includes('');
    // var checkConf = conf.includes('');
    // var checkEmail = email.includes('');
    
    // //CHECK IF PASSWORD CONFIRM IS EQUAL TO PASSWORD
    // if(((checkUser) == true) || ((checkPass) == true) || ((checkConf) == true) || ((checkEmail) == true))
    // {
    //   console.log('One or more fields was left blank.');
    //   errorMessage = 4;
    //   return errorMessage;
    // }
    if( (pass.length) < 8)
    {
      console.log('Passwords cannot be less than 8 characters!');
      errorMessage = 1;
      return errorMessage;
      
    }
    else if ((pass) != (conf))
    {
      console.log('Passwords do not match!');
      errorMessage = 2;
      return errorMessage;
    }
    else if((checkEmailAt) == false || (checkEmailPeriod) == false)
    {
      console.log('Emails cannot be missing an @ or a . symbol. ');
      errorMessage = 3;
      return errorMessage;
    }
    else{
      var jsonPayload = {
          username: user,
          password: pass,
          email: email,
        }

    fetch(global.baseURL + '/api/signup',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonPayload)})
        // .then(response => response.json())
        // .then(data => );
          //USE FOR 200, 400, 500, ETC
          .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            
            console.log(response.status);

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;

                if(response.status == 400)
                  {
                    console.log("Invalid object was passed to API, please try again.")
                    errorMessage = 4;
                    return errorMessage;
                  }

                  if(response.status == 500)
                  {
                    console.log("Internal server error. Please try again later.")
                    errorMessage = 5;
                    return errorMessage;
                  }
                
                return Promise.reject(error);
            }
            else
            console.log("SUCCESSFUL PASS!");

            //GRAB LOGIN API AND PASS THROUGH THE PARAMS AND LOG THEM IN AUTOMATICALLY THROUGH LOGIN

            //GRAB USER ID FROM API ONCE THEY REGISTER SO WE CAN AUTOMATICALLY LOG THEM IN
            
            // navigation.navigate("login");
            // saveCookie();
            //REDIRECT HERE
            // this.setState({ postId: data.id })
        })
        .catch(error => {
            // this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
      // }
    }
  
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
              //will store jwt into local storage
              console.log(data);
              console.log
              storeToken(data); 
              console.log("SUCCESSFUL LOGIN + TOKEN UPLOAD!");
              
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
    // var checkEmail = email.includes('');
    
    // //CHECK IF PASSWORD CONFIRM IS EQUAL TO PASSWORD
    // if(((checkUser) == true) || ((checkPass) == true) || ((checkConf) == true) || ((checkEmail) == true))
    // {
    //   console.log('One or more fields was left blank.');
    // }
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
            errorMessage = 7;
            return errorMessage;
              
        })
        .catch(error => {
            // this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
     
    }
  }

  //TO-DO: ERROR HANDLING
  //TO-DO: SEND SOMEONE BACK TO THE MAP
  function newPassFetch(pass, conf){

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
        }

    fetch(global.baseURL + '/api/reset/:idToken/:pwToken',
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

            // saveCookie();
            
            // this.setState({ postId: data.id })
        })
        .catch(error => {
            // this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
     
    }

  }

  function verifyEmailFetch(email){
    
    let errorMessage = 0;
    console.log(email);

    var checkEmailAt = email.includes("@");
    var checkEmailPeriod = email.includes(".");
    // var checkPass = pass.includes('');
    // var checkUser = user.includes('');
    // var checkConf = conf.includes('');
    // var checkEmail = email.includes('');
    
    // //CHECK IF PASSWORD CONFIRM IS EQUAL TO PASSWORD
    // if(((checkUser) == true) || ((checkPass) == true) || ((checkConf) == true) || ((checkEmail) == true))
    // {
    //   console.log('One or more fields was left blank.');
    //   errorMessage = 4;
    //   return errorMessage;
    // }
    if((checkEmailAt) == false || (checkEmailPeriod) == false)
    {
      console.log('Emails cannot be missing an @ or a . symbol. ');
      errorMessage = 1;
      return errorMessage;
    }
    else{
      var jsonPayload = {
          username: user,
          password: pass,
          email: email,
        }

    fetch(global.baseURL + '/api/verify-email',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonPayload)})
        // .then(response => response.json())
        // .then(data => );
          //USE FOR 200, 400, 500, ETC
          .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            
            console.log(response.status);

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;

                if(response.status == 400)
                  {
                    console.log("Invalid object was passed to API, please try again.")
                    errorMessage = 4;
                    return errorMessage;
                  }

                  if(response.status == 500)
                  {
                    console.log("Internal server error. Please try again later.")
                    errorMessage = 5;
                    return errorMessage;
                  }
                
                return Promise.reject(error);
            }
            else
            console.log("SUCCESSFUL PASS!");

            //GRAB LOGIN API AND PASS THROUGH THE PARAMS AND LOG THEM IN AUTOMATICALLY THROUGH LOGIN

            //GRAB USER ID FROM API ONCE THEY REGISTER SO WE CAN AUTOMATICALLY LOG THEM IN
            
            // navigation.navigate("login");
            // saveCookie();
            //REDIRECT HERE
            // this.setState({ postId: data.id })
        })
        .catch(error => {
            // this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
      // }
    }
  
  }

  function storeToken ( tok )
{
    try
    {
      localStorage.setItem('token_data', tok.accessToken);
    }
    catch(e)
    {
      console.log(e.message);
    }
  }

  function retrieveToken ()
  {
      var ud;
      try
      {
        ud = localStorage.getItem('token_data');
      }
      catch(e)
      {
        console.log(e.message);
      }
      return ud;
  }
  export {registrationFetch, loginFetch, forgotPassFetch, newPassFetch};