document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'http://localhost:3000/incidentes';

    function fetchIncidents() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const incidentList = document.getElementById('incidents');
                incidentList.innerHTML = '';
                data.forEach(incident => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${incident.titulo}</strong>
                        <p>${incident.descripcion}</p>
                        <span>Estado: ${incident.estado}</span>
                        <button onclick="deleteIncident(${incident.id})">Eliminar</button>
                    `;
                    incidentList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function createIncident(event) {
        event.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const estado = document.getElementById('estado').value;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, descripcion, estado })
        })
        .then(response => response.json())
        .then(() => {
            fetchIncidents();
            document.getElementById('form').reset();
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteIncident(id) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchIncidents())
        .catch(error => console.error('Error:', error));
    }

    document.getElementById('form').addEventListener('submit', createIncident);
    fetchIncidents();
});
