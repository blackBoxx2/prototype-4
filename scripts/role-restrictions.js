// code to restrict access depending on role for create and edit

function setAccordionAccess() {

    const userRole = localStorage.getItem('userRole');

    // list of matching roles and accordions
    const accordionRoles = [
        { id: 'qaAccordion', role: 'QA' },
        { id: 'engineeringAccordion', role: 'Engineer' },
        { id: 'purchasingAccordion', role: 'Purchasing' }
    ];

    // Loop accordions -access based on role
    accordionRoles.forEach(({ id, role }) => {
        const accordion = document.getElementById(id);
        const isEnabled = userRole === role || userRole === 'Admin';

        if (accordion) {        // looping the fields and disabling off role
            accordion.querySelectorAll('input, textarea, select').forEach((element) => {
                element.disabled = !isEnabled; 
            });

            if (userRole === role || userRole === 'Admin') {
                const button = accordion.querySelector('.accordion-button');
                const collapse = accordion.querySelector('.accordion-collapse');

                if (button && collapse) {
                    button.classList.remove('collapsed'); 
                    collapse.classList.add('show'); 
                    collapse.style.display = 'block'; 
                }
            }           
        }
    });
}

// set the page as it loads
document.addEventListener('DOMContentLoaded', setAccordionAccess);
