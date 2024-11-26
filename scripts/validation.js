
function validate() {
    clearValidation();
    const validated_divs = document.querySelectorAll("fieldset > div:not([class*='no-validate'])");
    var invalid = 0;
    validated_divs.forEach((el) => { 
        const input = el.querySelector("input");
        const validation_el = el.querySelector("div.text-danger");
        if (input.value.trim() == null || input.value.trim() == "") {
            validation_el.innerHTML = `${input.ariaLabel} cannot be empty`;
            invalid++;
        } else if (input.type == "number" && isNaN(input.value)) {
            validation_el.innerHTML = `${input.ariaLabel} must be a number`;
            invalid++;
        } else if (input.id == "quantityDefective" && input.value > document.querySelector("#quantityOrdered").value) {
            validation_el.innerHTML = "Quantity defective cannot be greater than quantity ordered";
            invalid++;
        }
    });

    const defect = document.querySelector("#defect");
    if (defect.selectedIndex <= 0) {
        var validation_el = defect.parentElement.parentElement.querySelector("div.text-danger");
        validation_el.innerHTML = "You must select a defect";
    }

    if (invalid > 0) {
        return false 
    }
    return true; 
}

function clearValidation() {
    const validation_els = document.querySelectorAll("div[id*='Validation']");
    validation_els.forEach((input) => {
        input.innerHTML = "";
    });
}
