// =======================
// CONFIRM SCRIPT IS LOADED
// =======================
console.log("script.js loaded");

// =======================
// PRODUCT DATA
// =======================
const products = [
    {
        id: 1,
        name: "PSG Home Jersey",
        team: "PSG",
        price: 1299,
        category: "international",
        image: "psg.jpg"
    },
    {
        id: 2,
        name: "Real Madrid Away Jersey",
        team: "Real Madrid",
        price: 1249,
        category: "international",
        image: "real-madrid-away-25-26.jpg"
    },
    {
        id: 3,
        name: "Mamelodi Sundowns Home Jersey",
        team: "Sundowns",
        price: 899,
        category: "psl",
        image: "SD-LOGO.jpg"
    }
];

// =======================
// ELEMENTS
// =======================
const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const categoryButtons = document.querySelectorAll(".category-btn");

let cart = [];

// =======================
// RENDER PRODUCTS
// =======================
function renderProducts(category = "all") {
    productsGrid.innerHTML = "";

    const filtered =
        category === "all"
            ? products
            : products.filter(p => p.category === category);

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>R ${product.price}</p>
            <button>Add to cart</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
            addToCart(product.id);
        });

        productsGrid.appendChild(card);
    });
}

// =======================
// ADD TO CART
// =======================
function addToCart(productId) {
    cart.push(productId);
    cartCount.textContent = cart.length;
}

// =======================
// CATEGORY FILTER
// =======================
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        renderProducts(button.dataset.category);
    });
});

// =======================
// INIT
// =======================
renderProducts();
