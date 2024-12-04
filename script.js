const routers = {
    R1: { x: 50, y: 50 },
    R2: { x: 500, y: 50 },
    R3: { x: 50, y: 300 },
    R4: { x: 500, y: 300 },
};

const adjacencyList = {
    R1: { R2: 1, R3: 1 },
    R2: { R1: 1, R4: 1 },
    R3: { R1: 1, R4: 1 },
    R4: { R2: 1, R3: 1 },
};

function simulatePacket(source, destination) {
    const packet = document.getElementById('packet');
    packet.classList.remove('hidden'); // Show the packet
    packet.style.left = `${routers[source].x}px`;
    packet.style.top = `${routers[source].y}px`;

    const path = findShortestPath(source, destination);
    let i = 0;

    function move() {
        if (i >= path.length - 1) {
            // Hide packet after reaching destination
            setTimeout(() => packet.classList.add('hidden'), 2000);
            updateTable(source, destination, path);
            return;
        }

        const currentRouter = document.getElementById(path[i]);
        const nextRouter = document.getElementById(path[i + 1]);

        currentRouter.classList.remove('active');
        nextRouter.classList.add('active');

        const { x, y } = routers[path[i + 1]];
        packet.style.left = `${x}px`;
        packet.style.top = `${y}px`;

        i++;
        setTimeout(move, 1000); // Delay for smoother movement
    }

    const startRouter = document.getElementById(path[i]);
    startRouter.classList.add('active');
    move();
}

function findShortestPath(start, end) {
    const queue = [start];
    const visited = new Set();
    const parent = {};

    while (queue.length) {
        const router = queue.shift();

        if (router === end) break;

        visited.add(router);

        for (const neighbor in adjacencyList[router]) {
            if (!visited.has(neighbor)) {
                parent[neighbor] = router;
                queue.push(neighbor);
            }
        }
    }

    const path = [];
    let current = end;

    while (current) {
        path.unshift(current);
        current = parent[current];
    }

    return path;
}

function updateTable(source, destination, path) {
    const tableBody = document.getElementById('tableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
    <td>${source}</td>
    <td>${destination}</td>
    <td>${path.length - 1}</td>
    <td>${path.join(' → ')}</td>
  `;

    tableBody.appendChild(newRow);
}

document.getElementById('startSimulation').addEventListener('click', () => {
    const source = document.getElementById('sourceRouter').value;
    const destination = document.getElementById('destinationRouter').value;

    if (source === destination) {
        alert('Source and destination cannot be the same!');
        return;
    }

    simulatePacket(source, destination);
});
