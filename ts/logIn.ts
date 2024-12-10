//Load the page
import { DatabaseLib } from "./database";
import * as $ from "jquery";
import { Models } from "./Models";
import jsPDF from "jspdf";
import { error } from "jquery";
document.addEventListener('DOMContentLoaded', function() {
    //create an object 
    localStorage.setItem("userID", 'null');
    localStorage.setItem("logInDate", 'null');
    
        const account ={
            email: '',
            password: ''
        }
        const selected = localStorage.getItem('selectedNcrId');
        var db = DatabaseLib.Database.get();
        // db.ReSeed();
        const users = db.tables.Users;
        //Take the vairables needed for the log in 
        const inputEmail = document.querySelector('#email') as HTMLInputElement;
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
        console.log(users);
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
                email[e.target.name] as HTMLInputElement | null;
                proveEmail();
                return;
            };
            
            cleanAlert(e.target.parentElement);

            //Login click event
            btnLogIn.addEventListener('click', (e) =>{
                e.preventDefault();
                //setup/reset values
                var userid: String | null = null;
                var userLogInDate: String | null = null;
                var userRole: String = "n/a";
                if (selected) {
                    const inputEmailValue = inputEmail.value.trim().toLocaleLowerCase(); 
                    const isUser: boolean = users.some((user: any) => {
                        const userEmail = user.Email;
                        return userEmail === inputEmailValue;
                    });
                    if(isUser){
                        //find the user that strictly equals the 
                        const user = users.find((user: any) => user.Email === inputEmailValue);
                        userid = String(user?.ID);
                        userLogInDate = String(user?.LastLoggedIn);
                        if(user?.Roles.Admin)
                            userRole = "Admin";
                        if(user?.Roles.Engineer)
                            userRole = "Engineer";
                        if(user?.Roles.Purchasing)
                            userRole = "Purchasing";
                        if(user?.Roles.QA)
                            userRole = "QA";
                        //set local storage properties
                        localStorage.setItem("userID", userid as string);
                        localStorage.setItem("logInDate", userLogInDate as string);
                        localStorage.setItem("userRole", userRole as string);
                        console.log('User Found in the database');
                        //return them to dashboard to view notifcations
                        window.location.href = '/Dashboard/index.html';
                    }else{
                        console.log('user Not Found in the database');
                    }
                }
            })
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

            let userRole = "";

            let user: Models.User | undefined;
            switch (optionsIndex) {
                case 1:
                    user = users.find((user: Models.User) => user.Roles.QA);
                    userRole = "QA";
                    break;
                case 2:
                    user = users.find((user: Models.User) => user.Roles.Engineer);
                    userRole = "Engineer";
                    break;
                case 3:
                    user = users.find((user: Models.User) => user.Roles.Purchasing);
                    userRole = "Purchasing";
                    break;
                case 4:
                    user = users.find((user: Models.User) => user.Roles.Admin);
                    userRole = "Admin";
                    break;
            }
        
            let userid = String(user?.ID);
            let userLogInDate = String(user?.LastLoggedIn);

            localStorage.setItem("userID", userid as string);
            localStorage.setItem("logInDate", userLogInDate as string);
            localStorage.setItem("userRole", userRole as string);
        
            window.location.href = '/Dashboard';
        }
    })
    
     
    