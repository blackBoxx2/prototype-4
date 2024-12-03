//Load the page
document.addEventListener('DOMContentLoaded', function () {
    //create an object 
    var account = {
        email: '',
        password: ''
    };
    //Take the vairables needed for the log in 
    var inputEmail = document.querySelector('#email');
    var inputPass = document.querySelector('#password');
    var form = document.querySelector('#form');
    var btnLogIn = document.querySelector('#form button[type="submit"]');
    var option = document.querySelector('#options-log');
    //register page 
    var inputUserName = document.querySelector('#username');
    var inputBirthDate = document.querySelector('#inp-birth');
    var inputPhone = document.querySelector('#inp-phone');
    var inputConfirmPassword = document.querySelector('#confirm-password');
    //assign events 
    inputEmail === null || inputEmail === void 0 ? void 0 : inputEmail.addEventListener('blur', validate);
    inputPass === null || inputPass === void 0 ? void 0 : inputPass.addEventListener('blur', validate);
    inputUserName === null || inputUserName === void 0 ? void 0 : inputUserName.addEventListener('blur', validate);
    inputBirthDate === null || inputBirthDate === void 0 ? void 0 : inputBirthDate.addEventListener('blur', validate);
    inputPhone === null || inputPhone === void 0 ? void 0 : inputPhone.addEventListener('blur', validate);
    inputConfirmPassword === null || inputConfirmPassword === void 0 ? void 0 : inputConfirmPassword.addEventListener('blur', validate);
    option === null || option === void 0 ? void 0 : option.addEventListener('click', selectTypeLogIn);
    //function for the validation 
    var email;
    function validate(e) {
        if (e.target.value.trim() === '') {
            showAlert("The ".concat(e.target.name, " field is required"), e.target.parentElement);
            return;
        }
        //validate for the email
        if (e.target.id === 'email' && !validateEmail(e.target.value)) {
            showAlert('The email is not valid', e.target.parentElement);
            email[e.target.name];
            proveEmail();
            return;
        }
        ;
        cleanAlert(e.target.parentElement);
        //assing the values
        email[e.target.name] = e.target.value.trim().toLowerCase();
        //prove the email object
    }
    function showAlert(mensaje, reference) {
        cleanAlert(reference);
        //If the alert already exist
        var ExistAlert = reference.querySelector('.error-message');
        if (ExistAlert) {
            ExistAlert.remove();
        }
        var error = document.createElement('P');
        error.textContent = mensaje;
        error.classList.add('error-message');
        //inject the error to the form
        reference.appendChild(error);
    }
    function cleanAlert(reference) {
        var alert = reference.querySelector('.error-message');
        if (alert) {
            alert.remove();
        }
    }
    function validateEmail(email) {
        var regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        var result = regex.test(email);
        console.log(result);
        return result;
    }
    function proveEmail() {
        if (Object["values"](email)) {
            btnLogIn.disabled = true;
            return;
        }
        btnLogIn.disabled = false;
    }
    function selectTypeLogIn() {
        var optionsIndex = option.selectedIndex;
        globalThis.UserRole = optionsIndex;
        switch (globalThis.UserRole) {
            case 1:
                // qa
                console.log("QA ", globalThis.UserRole);
                window.location.href = 'Index.html';
                break;
            case 2:
                // eng
                console.log("ENG ", globalThis.UserRole);
                break;
            case 3:
                // sales
                console.log("SALES ", globalThis.UserRole);
                break;
            case 4:
                // admin
                console.log("ADM ", globalThis.UserRole);
                break;
            default:
                console.log("NONE");
                // if they select outside of bounds
                break;
        }
    }
});
