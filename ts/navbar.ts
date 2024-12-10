//Create the footer
function createFooter() : void{
    const footer = document.createElement('footer');
    footer.classList.add('footer');

    const conteiner = document.createElement('div');
    conteiner.classList.add('footer-conteiner');

    const copyRight = document.createElement('p');
    copyRight.textContent = '© 2024 BlackBox2Inc. All rights reserved'

    const links: {text: string; href: string}[] =[
        {text: 'Policy of privacy', href:'#' },
        {text: 'Terms of services', href: '#'},
        {text: 'contact us', href: '#'}
    ];

    const divLinks = document.createElement('div');
    divLinks.classList.add('links-footer');

    links.forEach((l) => {
        const a = document.createElement('a');
        a.textContent = l.text;
        a.href = l.href;
        divLinks.appendChild(a);
    })
        
    conteiner.appendChild(copyRight);
    conteiner.appendChild(divLinks);
    footer.appendChild(conteiner);
    document.body.appendChild(footer);
}


//Create log out pop up
function LogOutCreate() {
    const mainDiv = document.createElement('Div');
    mainDiv.classList.add('main-div');

    const Conteiner = document.createElement('div');
    Conteiner.classList.add('popup-content');

    const text = document.createElement('p');
    text.textContent = 'You are about to log out, are you sure you want to do it?';

    const btnCanel = document.createElement('button');
    btnCanel.textContent = 'Cancel';
    btnCanel.id = 'btnCancel';

    const btnLogOut = document.createElement('button');
    btnLogOut.textContent = 'Log Out';
    btnLogOut.id = 'btnLogOut';

    Conteiner.appendChild(text);
    Conteiner.appendChild(btnCanel);
    Conteiner.appendChild(btnLogOut);
    

    mainDiv.appendChild(Conteiner)
    document.body.appendChild(mainDiv);

    return mainDiv;
}

//Create the nav
function NavCreate() : void {
    const nav = document.createElement('nav');
    nav.classList.add('navbar')

    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.classList.add('background-overlay');
    document.body.appendChild(backgroundOverlay);
    //Create the logo
    const img  =  document.createElement('img');
    img.src = '/imgs/crossfire_logo.png';
    img.alt = 'Crossfire Logo';
    img.classList.add('logo');
    //Create the link for the logo
    const imgLink = document.createElement('a');
    imgLink.href = 'index.html';
    imgLink.appendChild(img);

    const imgMenu = document.createElement('img');
    imgMenu.src = "/imgs/hamburguer_menu.png";
    imgMenu.classList.add('dropdown-button');
    imgMenu.classList.add('hamburguer-menu');

    //side bar
    const sideBar = document.createElement('Div');
    sideBar.classList.add('side-bar');
    //Close Logo
    const logoClose = document.createElement('img');
    logoClose.src = '/imgs/cross-circle.png';
    logoClose.alt = 'Close X';
    logoClose.classList.add('close-logo');
    sideBar.appendChild(logoClose);    
    //create the container 
    //Create the links container for the elements in the nav
    const links: {text: string; href: string; imgSrc: string}[] = [
        {text: 'Dashboard', href: '/Dashboard/index.html', imgSrc: '/imgs/dashboard_panel.png'},
        {text: 'NCR Log', href: '/NCRLog/index.html', imgSrc: '/imgs/ncr_log.png'},
        {text: 'Log Out', href: '#', imgSrc: '/imgs/logout.png'}
    ];
    //go trhougth every piece in the array to take the elements
    links.forEach(l =>{
        const a = document.createElement('a');
        //a.textContent = l.text;
        a.href = l.href;
        a.classList.add('dropdown-link')
        const logos = document.createElement('img');
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
    
    imgMenu.addEventListener('click', () =>{
        sideBar.classList.toggle('show');
        backgroundOverlay.classList.toggle('show');
    });

    logoClose.addEventListener('click', () => {
        console.log('Botón de cierre clickeado');
        sideBar.classList.remove('show');
    });
    //Create the pop up
    const popUp = LogOutCreate();

    const logoutLink = sideBar.querySelector('a[href="#"]');
    if(logoutLink){
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            popUp.style.display = 'flex';
            backgroundOverlay.classList.add('show');
        })
    }
    const cancelBtn = document.getElementById('btnCancel');
    if(cancelBtn){
        cancelBtn.addEventListener('click', () => {
            popUp.style.display = 'none';
            backgroundOverlay.classList.remove('show');
        });
    }
    const confirmBtn = document.getElementById('btnLogOut');
    if(confirmBtn){
        confirmBtn.addEventListener('click', () => {
            localStorage.setItem('userID', '');
            localStorage.setItem('logInDate', '');
            localStorage.setItem('userRole', '');
            window.location.href = '/Home/index.html'
        })
    }
    //If the user click in somewhere else close the nav 

    document.addEventListener('click', (e: MouseEvent) => {
        if (!sideBar.contains(e.target as Node) && e.target !== imgMenu) {
            sideBar.classList.remove('show');
            backgroundOverlay.classList.remove('show');
        }
    });
    document.addEventListener('click', (e: MouseEvent) => {
        if(!popUp.contains(e.target as Node) && !logoutLink?.contains(e.target as Node)){
            popUp.style.display = 'none';
            backgroundOverlay.classList.remove('show');
        }
    })
} 

document.addEventListener('DOMContentLoaded', () =>{
    NavCreate();
    createFooter();
});