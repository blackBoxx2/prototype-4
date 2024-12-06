//Load the page

document.addEventListener('DOMContentLoaded', function() {
    //create an object 
        const account ={
            email: '',
            password: ''
        }
    
        //Take the vairables needed for the log in 
        const inputEmail = document.querySelector('#email');
        const inputPass = document.querySelector('#password');
        const form = document.querySelector('#form');
        const btnLogIn = document.querySelector('#form button[type="submit"]') as HTMLButtonElement;
        const option = document.querySelector('#options-log') as HTMLSelectElement;
        //register page 
        const inputUserName = document.querySelector('#username');
        const inputBirthDate = document.querySelector('#inp-birth');
        const inputPhone = document.querySelector('#inp-phone');
        const inputConfirmPassword = document.querySelector('#confirm-password');
        //assign events 
        inputEmail?.addEventListener('blur', validate);
        inputPass?.addEventListener('blur', validate);
        inputUserName?.addEventListener('blur', validate);
        inputBirthDate?.addEventListener('blur', validate);
        inputPhone?.addEventListener('blur', validate);
        inputConfirmPassword?.addEventListener('blur', validate);
        option?.addEventListener('click',selectTypeLogIn);
        option?.addEventListener('change',selectTypeLogIn);
        //function for the validation 
        let email;
        function validate(e){
            if(e.target.value.trim() === ''){
                showAlert(`The ${e.target.name} field is required`, e.target.parentElement);
                return;
            }
             //validate for the email
            if(e.target.id === 'email' && !validateEmail(e.target.value)){
                showAlert('The email is not valid', e.target.parentElement);
                
                proveEmail();
                return;
            };
            
            cleanAlert(e.target.parentElement);
        }
        
        function showAlert(mensaje, reference){
            cleanAlert(reference);
            //If the alert already exist
            const ExistAlert = reference.querySelector('.error-message');
            if(ExistAlert){
                ExistAlert.remove();
            }
            const error = document.createElement('P');
            error.textContent = mensaje;
            error.classList.add('error-message')
            //inject the error to the form
            reference.appendChild(error);
        }
    
      function cleanAlert(reference){
            const alert = reference.querySelector('.error-message');
            if(alert){
                alert.remove(); 
            }
        }
    
        function validateEmail(email){
            const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
            const result = regex.test(email);
            console.log(result);
            return result;
        }
        function proveEmail(){
            if(Object["values"](email)){
                btnLogIn.disabled = true;
                return;
            }
            btnLogIn.disabled = false;
        }
        function selectTypeLogIn(): void {
            const option = document.querySelector('#options-log') as HTMLSelectElement;
            const optionsIndex = option.selectedIndex;
        
            if (optionsIndex === 0) {
                return;
            }
        
            localStorage.setItem('userRole', option.value);
        
            window.location.href = '/Dashboard';
        }
    })
    
     
    