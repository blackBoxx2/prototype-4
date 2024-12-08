//Create the nav
function NavCreate() {
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
    var imgMenu = document.createElement('img');
    imgMenu.src = "/imgs/hamburguer_menu.png";
    imgMenu.classList.add('dropdown-button');
    imgMenu.classList.add('hamburguer-menu');
    //create the container 
    var ddlMenu = document.createElement('ul');
    ddlMenu.classList.add('dropdown-menu');
    //Create the links container for the elements in the nav
    var links = [
        { text: 'Dashboard', href: 'index.html' },
        { text: 'NCR Log', href: '/Dashboard/index.html' },
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
    nav.appendChild(imgMenu);
    nav.appendChild(ddlMenu);
    //insert the nav bar
    document.body.insertBefore(nav, document.body.firstChild);
    imgMenu.addEventListener('click', function () {
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
document.addEventListener('DOMContentLoaded', NavCreate);
