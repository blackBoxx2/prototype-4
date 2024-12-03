//Create the nav
function createNav() {
    var nav = document.createElement('nav');
    nav.classList.add('navbar');
    //Create the logo
    var img = document.createElement('img');
    img.src = '/imgs/crossfire_logo.png';
    img.alt = 'Crossfire Logo';
    img.classList.add('logo');
    //Create the link for the logo
    var imgLink = document.createElement('a');
    imgLink.href = 'index.html';
    imgLink.appendChild(img);
    var ddlButton = document.createElement('button');
    //add the class for the button
    ddlButton.classList.add('dropdown-button');
    ddlButton.textContent = 'Menu';
    //create the container 
    var ddlMenu = document.createElement('div');
    ddlMenu.classList.add('dropdown-menu');
    //Create the links container for the elements in the nav
    var links = [
        { text: 'Dashboard', href: '/Dashboard' },
        { text: 'NCR Log', href: '/NCRLog' },
        { text: 'Log Out', href: '/Home' },
    ];
    //go trhougth every piece in the array to take the elements
    links.forEach(function (l) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = l.text;
        a.href = l.href;
        a.classList.add('dropdown-link');
        li.appendChild(a);
        ddlMenu.appendChild(li);
    });
    nav.appendChild(imgLink);
    nav.appendChild(ddlButton);
    nav.appendChild(ddlMenu);
    //insert the nav bar
    document.body.insertBefore(nav, document.body.firstChild);
    ddlButton.addEventListener('click', function () {
        ddlMenu.classList.toggle('show');
    });
    //If the user click in somewhere else close the nav 
    document.addEventListener('click', function (e) {
        var ddlMenu = document.querySelector('.dropdown-menu');
        var ddlButton = document.querySelector('.dropdown-button');
        if (ddlMenu && ddlButton) {
            if (e.target !== ddlButton && !ddlMenu.contains(e.target)) {
                ddlMenu.classList.remove('show');
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', createNav);
//encontrar la manera de hacer que el nav bar pueda usar links y eso 
//crear las clases en el html
//crear el css 
