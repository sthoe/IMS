 
document.getElementById('newItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('newItemName').value.trim();
    const quantity = parseInt(document.getElementById('newItemQuantity').value);
    
    if (!name || quantity < 0 || isNaN(quantity)) {
        alert('Please enter a valid name and quantity.');
    } else {
        createItem(name, quantity);
    }
});

document.getElementById('searchQuery').addEventListener('input', function(event) {
    
    const query = event.target.value.trim();
    
    if (!query) {
        loadItems();
    } else {
        searchItem(query);
    }
});

function createItem(name, quantity) {
    fetch('http://localhost:3000/stock-items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            quantity: quantity
        }),
    })
    .then(() => {
        alert(`Item ${name} created`);
        location.reload();
    });
}

function updateItem(id) {
    const newQuantity = parseInt(prompt("Enter new quantity"));

    if (newQuantity < 0 || isNaN(newQuantity)) {
        alert('Please enter a valid quantity.');
    } else {
        fetch(`http://localhost:3000/stock-items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quantity: newQuantity
            }),
        })
        .then(() => {
            alert(`Item ${id} updated`);
            location.reload();
        });
    }
}

function deleteItem(id) {
    fetch(`http://localhost:3000/stock-items/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        alert(`Item ${id} deleted`);
        location.reload();
    });
}

function loadItems() {
    fetch('http://localhost:3000/stock-items')
    .then(response => response.json())
    .then(data => displayItems(data));
}


function searchItem(query) {
    fetch(`http://localhost:3000/stock-items/search/${query}`)
    .then(response => response.json())
    .then(data => displayItems(data));
    

}

function displayItems(data) {
    const itemsContainer = document.getElementById('items');
    itemsContainer.innerHTML = '';
    data.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        if(item.quantity < 10) itemElement.classList.add('low-stock');
        
        itemElement.innerHTML = `
            <p><strong>ID:</strong> ${item.id}</p>
            <p><strong>Name:</strong> ${item.name}</p>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <input type="button" value="Delete" onclick="deleteItem(${item.id})" />
            <input type="button" value="Update" onclick="updateItem(${item.id})" />
        `;
        itemsContainer.appendChild(itemElement);
        
    });
}


// Initially load all items
loadItems();

