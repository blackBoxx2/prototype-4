//Create the footer
function createFooter() {
    var footer = document.createElement('footer');
    footer.classList.add('footer');
    var conteiner = document.createElement('div');
    conteiner.classList.add('footer-conteiner');
    var copyRight = document.createElement('p');
    copyRight.textContent = '© 2024 BlackBox2Inc. All rights reserved';
    var links = [
        { text: 'Policy of privacy', href: '#' },
        { text: 'Terms of services', href: '#' },
        { text: 'contact us', href: '#' }
    ];
    var divLinks = document.createElement('div');
    divLinks.classList.add('links-footer');
    links.forEach(function (l) {
        var a = document.createElement('a');
        a.textContent = l.text;
        a.href = l.href;
        divLinks.appendChild(a);
    });
    conteiner.appendChild(copyRight);
    conteiner.appendChild(divLinks);
    footer.appendChild(conteiner);
    document.body.appendChild(footer);
}
//Create log out pop up
function LogOutCreate() {
    var mainDiv = document.createElement('Div');
    mainDiv.classList.add('main-div');
    var Conteiner = document.createElement('div');
    Conteiner.classList.add('popup-content');
    var text = document.createElement('p');
    text.textContent = 'You are about to log out, are you sure you want to do it?';
    var btnCanel = document.createElement('button');
    btnCanel.textContent = 'Cancel';
    btnCanel.id = 'btnCancel';
    var btnLogOut = document.createElement('button');
    btnLogOut.textContent = 'Log Out';
    btnLogOut.id = 'btnLogOut';
    Conteiner.appendChild(text);
    Conteiner.appendChild(btnCanel);
    Conteiner.appendChild(btnLogOut);
    mainDiv.appendChild(Conteiner);
    document.body.appendChild(mainDiv);
    return mainDiv;
}
//Create the nav
function NavCreate() {
    var nav = document.createElement('nav');
    nav.classList.add('navbar');
    var backgroundOverlay = document.createElement('div');
    backgroundOverlay.classList.add('background-overlay');
    document.body.appendChild(backgroundOverlay);
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
    //side bar
    var sideBar = document.createElement('Div');
    sideBar.classList.add('side-bar');
    //Close Logo
    var logoClose = document.createElement('img');
    logoClose.src = '/imgs/cross-circle.png';
    logoClose.alt = 'Close X';
    logoClose.classList.add('close-logo');
    sideBar.appendChild(logoClose);
    //create the container 
    //Create the links container for the elements in the nav
    var links = [
        { text: 'Dashboard', href: '/Dashboard/index.html', imgSrc: '/imgs/dashboard_panel.png' },
        { text: 'NCR Log', href: '/NCRLog/index.html', imgSrc: '/imgs/ncr_log.png' },
        { text: 'Log Out', href: '#', imgSrc: '/imgs/logout.png' }
    ];
    //go trhougth every piece in the array to take the elements
    links.forEach(function (l) {
        var a = document.createElement('a');
        //a.textContent = l.text;
        a.href = l.href;
        a.classList.add('dropdown-link');
        var logos = document.createElement('img');
        logos.src = l.imgSrc;
        logos.alt = l.text + 'icon';
        logos.classList.add('icon-img');
        a.appendChild(logos);
        a.appendChild(document.createTextNode(l.text));
        sideBar.appendChild(a);
    });
    document.body.appendChild(sideBar);
    nav.appendChild(imgMenu);
    //nav.appendChild(ddlMenu);
    nav.appendChild(imgLink);
    document.body.insertBefore(nav, document.body.firstChild);
    imgMenu.addEventListener('click', function () {
        sideBar.classList.toggle('show');
        backgroundOverlay.classList.toggle('show');
    });
    logoClose.addEventListener('click', function () {
        console.log('Botón de cierre clickeado');
        sideBar.classList.remove('show');
    });
    //Create the pop up
    var popUp = LogOutCreate();
    var logoutLink = sideBar.querySelector('a[href="#"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            popUp.style.display = 'flex';
            backgroundOverlay.classList.add('show');
        });
    }
    var cancelBtn = document.getElementById('btnCancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            popUp.style.display = 'none';
            backgroundOverlay.classList.remove('show');
        });
    }
    var confirmBtn = document.getElementById('btnLogOut');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            localStorage.setItem('userID', '');
            localStorage.setItem('logInDate', '');
            localStorage.setItem('userRole', '');
            window.location.href = '/Home/index.html';
        });
    }
    //If the user click in somewhere else close the nav 
    document.addEventListener('click', function (e) {
        if (!sideBar.contains(e.target) && e.target !== imgMenu) {
            sideBar.classList.remove('show');
            backgroundOverlay.classList.remove('show');
        }
    });
    document.addEventListener('click', function (e) {
        if (!popUp.contains(e.target) && !(logoutLink === null || logoutLink === void 0 ? void 0 : logoutLink.contains(e.target))) {
            popUp.style.display = 'none';
            backgroundOverlay.classList.remove('show');
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    NavCreate();
    createFooter();
});
