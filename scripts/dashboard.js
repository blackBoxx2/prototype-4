
fetch('/head.html')
    .then(response => response.text())
    .then(data => {
        document.head.innerHTML = data;
        document.title = "Dashboard";

        const stylesheets = ['dashboard.css', 'modals.css', 'navbar.css', 'breadcrumbs.css'];
        stylesheets.forEach(file => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `/css/${file}`;
            document.head.appendChild(link);
        });
    });

document.addEventListener("DOMContentLoaded", () => {
    Promise.all([
        fetch('/main-header.html').then(res => res.text()),
        fetch('/footer.html').then(res => res.text())
    ])
    .then(([headerData, footerData]) => {
        document.querySelector('header').innerHTML = headerData;
        document.getElementById('footer').innerHTML = footerData;
    });

    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
        alert("No user role found. Redirecting to login.");
        window.location.href = '/login.html';
        return;
    }

    const roleActions = {
        QA: [
            { name: 'Create New', link: '/NCRLog/create.html' },
            { name: 'View Logs', link: '/NCRLog/index.html' }
        ],
        Engineer: [
            { name: 'Filtered Logs', link: 'no-filtered-logs' },
            { name: 'View Logs', link: '/NCRLog/index.html' }
        ],
        Purchasing: [
            { name: 'View Reports', link: 'no-reports-page' },
            { name: 'View Logs', link: '/NCRLog/index.html' }
        ],
        Admin: [
            { name: 'View Reports', link: 'no-reports-page' },
            { name: 'View Logs', link: '/NCRLog/index.html' }
        ]
    };
    
    // load buttons based on the role
    const roleButtons = document.getElementById('role-buttons');
    if (roleActions[userRole]) {
        roleActions[userRole].forEach(action => {
            const button = document.createElement('button');
            button.className = 'cta-btn role-action-btn';
            button.textContent = action.name;
            button.addEventListener('click', () => {
                window.location.href = action.link;
            });
            roleButtons.appendChild(button);
        });
    } else {
        roleButtons.textContent = "No actions available for your role.";
    }

    // mock data, to be replaced with ts file and data from database
    const recentNCRs = [
        { id: 1, description: 'Defective Iteams Received', createdOn: '2024-12-01', status: 'Open' },
        { id: 2, description: 'Quality Problem With Load', createdOn: '2024-11-28', status: 'Closed' },
        { id: 3, description: 'Damaged Units/ Products', createdOn: '2024-11-20', status: 'Open' },
        { id: 4, description: 'Tempature Issue', createdOn: '2024-11-18', status: 'Closed' },
        { id: 5, description: 'Incorrect Iteams Recieved', createdOn: '2024-11-15', status: 'Open' }
    ];
    
    const tableBody = document.querySelector('#ncr-table tbody');
    recentNCRs.forEach(ncr => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ncr.description}</td>
            <td>${ncr.createdOn}</td>
            <td>${ncr.status}</td>
            <td>
                <button class="cta-btn cta-btn-small cta-btn-edit" onclick="location.href='/NCRLog/edit.html?id=${ncr.id}'">Edit</button>
                <button class="cta-btn cta-btn-small cta-btn-view" onclick="location.href='/NCRLog/Details.html?id=${ncr.id}'">Details</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
});
