const deployments = [
    {
        name: 'Deployments',
        createdOn: '23.07.2022',
        description: 'Frontend app with information about deployments and its status',
        url: 'https://deployments.tomondre.com'
    }, {
        name: 'Is OK',
        createdOn: '23.07.2022',
        description: 'Super simple app that liveness of a server',
        url: 'https://is-ok.tomondre.com'

    }, {
        name: 'Cloud',
        createdOn: '20.07.2022',
        description: 'Nextcloud instance that provides access to the cloud storage',
        url: 'https://cloud.tomondre.com'

    }, {
        name: 'Url Shortener',
        createdOn: '20.07.2022',
        description: 'APP that let you shorten urls',
        url: 'https://url.tomondre.com'
    }, {
        name: 'Traefik Dashboard',
        createdOn: '17.05.2022',
        description: 'Traefik dashboard exposed on the internet with "Basic" HTTP authentication',
        url: 'https://traefik.tomondre.com'
    }, {
        name: 'Kubernetes Dashboard',
        createdOn: '17.05.2022',
        description: 'Kubernetes dashboard',
        url: 'https://kubernetes.tomondre.com'
    }, {
        name: 'Portfolio',
        createdOn: '15.05.2022',
        description: 'Portfolio website with information about me and my work',
        url: 'https://portfolio.tomondre.com'
    }, {
        name: 'Lego Scraper',
        createdOn: '15.05.2022',
        description: 'API that returns scraped information about the LEGO products',
        url: 'https://lego-scraper.tomondre.com'
    }, {
        name: 'Api CV',
        createdOn: '13.05.2022',
        description: 'Node.js app that provides my CV information in the json format',
        url: 'https://api-cv.tomondre.com'
    }
]

let tableElements = [];
const statusCheckUrl = "https://is-ok.tomondre.com";

deployments.forEach(deployment => {
    tableElements.push($(`
        <tr class="alert" role="alert">
            <td class="td-name">${deployment.name}</td>
            <td class="td-created-on">${deployment.createdOn}</td>
            <td class="td-description">${deployment.description}</td>
            <td class="td-url"><a href="${deployment.url}" target="_blank">${deployment.url.replace(/^https?:\/\//, '')}</a></td>
            <td class="status" style="padding: 0;"><span class="waiting">Loading</span></td>
        </tr>
		`));
    $('tbody').append(tableElements)
});

function setActiveStatus(name) {
    setStatus(name, 'active', 'Active');
}

function setInactiveStatus(name) {
    setStatus(name, 'waiting', 'Inactive');
}

function setStatusUnknown() {
    tableElements.forEach(element => {
        element.find('td.status').html(`<span class="waiting">Unknown</span>`);
    });
}

function setStatus(name, statusClass, statusText) {
    tableElements.forEach(element => {
        if (element.find('td.td-name').text() === name) {
            element.find('td.status').html(`<span class="${statusClass}">${statusText}</span>`);
        }
    });
}

$.ajax({
    url: statusCheckUrl + '/health',
    error: () => setStatusUnknown(),
    success: () => checkDeploymentStatuses(),
})

function checkDeploymentStatuses() {
    deployments.forEach(deployment => {
        $.ajax({
            url: statusCheckUrl + '?url=' + deployment.url,
            type: 'GET',
            success: () => setActiveStatus(deployment.name),
            error: () => setInactiveStatus(deployment.name)
        })
    });
}



