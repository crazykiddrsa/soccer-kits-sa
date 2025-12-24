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
        name: "PSG Away Jersey",
        team: "PSG",
        price: 1199,
        category: "international",
        image: "PSG-J2.jpg"
    },
    {
        id: 2,
        name: "Real Madrid Away Jersey",
        team: "Real Madrid",
        price: 1249,
        category: "international",
        image: "RM-J2.jpg"
    },
    {
        id: 3,
        name: "Mamelodi Sundowns Home Jersey",
        team: "Sundowns",
        price: 899,
        category: "psl",
        image: "SD-J.jpg"
    }
];

// =======================
// ELEMENTS
// =======================
const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");

// optional (only if they exist in HTML)
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const categoryButtons = document.querySelectorAll(".category-btn");

// =======================
// CART STATE
// =======================
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
            addToCart(product);
        });

        productsGrid.appendChild(card);
    });
}

// =======================
// ADD TO CART
// =======================
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
}

// =======================
// UPDATE CART UI
// =======================
function updateCartUI() {
    // update counter
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalQty;

    // optional detailed cart
    if (cartItems && cartTotal) {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.qty;

            const li = document.createElement("li");
            li.textContent = `${item.name} × ${item.qty} — R${item.price * item.qty}`;
            cartItems.appendChild(li);
        });

        cartTotal.textContent = total;
    }
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
updateCartUI();
