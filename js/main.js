const deploymentsApiUrl = 'https://api.tomondre.com/deployments';

let deployments;
$.ajax({
    url: deploymentsApiUrl,
    type: 'GET',
    success: (data) => {
        deployments = data;

        let tableElements = [];
        const statusCheckUrl = "https://is-ok.tomondre.com";

        deployments.forEach(deployment => {
            tableElements.push($(`
        <tr class="alert" role="alert">
            <td class="td-name">${deployment.name}</td>
            <td class="td-description">${deployment.description}</td>
            <td class="td-deployed-on">${new Date(deployment.deployedOn).toLocaleDateString("en-US")}</td>
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
                    url: statusCheckUrl + '?url=' + deployment.healthUrl,
                    type: 'GET',
                    success: () => setActiveStatus(deployment.name),
                    error: () => setInactiveStatus(deployment.name)
                })
            });
        }
    }
});


