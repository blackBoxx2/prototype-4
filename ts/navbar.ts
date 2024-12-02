//Create the nav
function createNav() : void {
    const nav = document.createElement('nav');
    nav.classList.add('navbar')

    //Create the logo
    const img  =  document.createElement('img');
    img.src = './imgs/crossfire_logo.png';
    img.alt = 'Crossfire Logo';
    img.classList.add('logo');
    //Create the link for the logo
    const imgLink = document.createElement('a');
    imgLink.href = 'index.html';
    imgLink.appendChild(img);

    const ddlButton = document.createElement('button');
    //add the class for the button
    ddlButton.classList.add('dropdown-button');
    ddlButton.textContent = 'Menu';

    //create the container 
    const ddlMenu = document.createElement('div');
    ddlMenu.classList.add('dropdown-menu');

    //Create the links container for the elements in the nav
    const links: {text: string; href: string}[] = [
        {text: 'Index', href: 'index.html'},
        {text: 'ncr Log', href: 'ncrlog.html'},
    ];
    //go trhougth every piece in the array to take the elements
    links.forEach(l =>{
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = l.text;
        a.href = l.href;
        a.classList.add('dropdown-link')
        li.appendChild(a);
        ddlMenu.appendChild(li); 
    });
    nav.appendChild(imgLink);
    nav.appendChild(ddlButton);
    nav.appendChild(ddlMenu);
    
    //insert the nav bar
    document.body.insertBefore(nav, document.body.firstChild);

    ddlButton.addEventListener('click', () =>{
        ddlMenu.classList.toggle('show');
    })
    //If the user click in somewhere else close the nav 
    document.addEventListener('click', (e : MouseEvent) => {
        const ddlMenu = document.querySelector('.dropdown-menu') as HTMLElement | null;
        const ddlButton = document.querySelector('.dropdown-button') as HTMLElement | null;
    
    
       if (ddlMenu && ddlButton) {
            if(e.target !== ddlButton && !ddlMenu.contains(e.target as Node)){
                ddlMenu.classList.remove('show');
            }
        }
    });
} 

document.addEventListener('DOMContentLoaded', createNav);

//encontrar la manera de hacer que el nav bar pueda usar links y eso 
//crear las clases en el html
//crear el css 