const loadAllProduct = () => {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
        .then(res => res.json())
        .then(data => {
            if (data.drinks) {
                displayProduct(data.drinks);
            } else {
                console.log("No products found");
            }
        })
        .catch(error => console.error("Error fetching products:", error));
};

const displayProduct = (products) => {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("card", "p-2", "col-lg-3");
        div.innerHTML = `
            <img class="card-img-top" src="${product.strDrinkThumb}" alt="${product.strDrink}">
            <div class="card-body">
                <h5 class="card-title">${product.strDrink.slice(0, 20)}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Category: ${product.strCategory || 'N/A'}</h6>
                <p class="card-text">${product.strInstructions?.slice(0, 50) || 'No description available'}</p>
                <button class="btn btn-warning btn-sm" onclick="singleProduct('${product.idDrink}')">Details</button>
                <button class="btn btn-success btn-sm" onclick="handleAddToCart('${product.strDrink}', '${product.strDrinkThumb}')">Add to Cart</button>
            </div>
        `;
        productContainer.appendChild(div);
    });
};

// Add product to the carts
const handleAddToCart = (title, image) => {
    const cartCount = document.getElementById("count").innerText;
    let convertCount = parseInt(cartCount) || 0;

    if (convertCount < 7) { 
        convertCount++;
        document.getElementById("count").innerText = convertCount;

        const cartMainContainer = document.getElementById("cart-main-container");

        const div = document.createElement("div");
        div.classList.add("cart-info");
        div.innerHTML = `
            <p>${convertCount}</p>
            <img src="${image}" alt="${title}" style="width: 50px; height: 50px;">
            <p>${title.slice(0, 10)}</p>
        `;
        cartMainContainer.appendChild(div);

        const existingHR = cartMainContainer.querySelector("hr:last-child");
        if (existingHR) {
            existingHR.remove();
        }

        const hr = document.createElement("hr");
        cartMainContainer.appendChild(hr);

    } else {
        alert("You have reached the max limit");
    }
};


const singleProduct = (id) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.drinks) {
                displaySingleProductDetails(data.drinks[0]);
            }
        })
        .catch(error => console.error('Error fetching single product:', error));
};

const displaySingleProductDetails = (product) => {
    const modalBody = document.getElementById('product-modal-details');
    modalBody.innerHTML = `
        <div class="text-center mb-3">
            <h4>${product.strDrink}</h4>
        </div>
        <div class="text-center mb-3">
            <img src="${product.strDrinkThumb}" alt="${product.strDrink}" class="img-fluid rounded" style="max-height: 300px; object-fit: cover;">
        </div>
        <div class="text-start">
            <p><strong>Category:</strong> ${product.strCategory || 'N/A'}</p>
            <p><strong>Alcoholic:</strong> ${product.strAlcoholic || 'N/A'}</p>
            <p>${product.strInstructions?.slice(0, 150) || 'No instructions available.'}</p>
        </div>
        <hr>
    `;
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
};

// Search products
const searchProduct = (query) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => {
            if (data.drinks) {
                displayProduct(data.drinks);
            } else {
                displayNotFound();
            }
        })
        .catch(error => console.error("Error searching products:", error));
};

const displayNotFound = () => {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = `
        <p class="text-danger notFoundText">
            Product Not Found.
        </p>
    `;
};

// Search button event listener
document.getElementById('btn-search').addEventListener('click', () => {
    const searchItem = document.getElementById('gsearch').value;
    if (searchItem) {
        searchProduct(searchItem);
    } else {
        alert('Please enter a search term!');
    }
});

loadAllProduct();
