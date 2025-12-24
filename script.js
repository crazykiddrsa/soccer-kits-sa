// ===========================
// Soccer Kits SA - Full Script.js
// ===========================
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTS
    // =========================
    const productsGrid = document.getElementById("productsGrid");
    const cartCount = document.getElementById("cartCount");
    const cartPanel = document.getElementById("cartPanel");
    const openCartBtn = document.getElementById("cartBtn");
    const closeCartBtn = document.getElementById("closeCart");
    const cartItemsContainer = document.getElementById("cartItems");
    const subtotalEl = document.getElementById("subtotal");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const notification = document.getElementById("cartNotification");
    const teamsGrid = document.getElementById("teamsGrid");
    const categoryButtons = document.querySelectorAll(".category-btn");

    // =========================
    // PRODUCT DATA
    // =========================
    const products = [
    {id: 1, name: "PSG Away Jersey", team: "PSG", price: 1199, category: "international", image: "PSG-J2.jpg"},
    {id: 2, name: "Real Madrid Away Jersey", team: "Real Madrid", price: 1249, category: "international", image: "RM-J2.jpg"},
    {id: 3, name: "Barcelona Away Jersey", team: "Barcelona", price: 1299, category: "international", image: "FCB-J2.jpg"},
    {id: 4, name: "Liverpool Home Jersey", team: "Liverpool", price: 1099, category: "international", image: "LFC-J.jpg"},
    {id: 5, name: "Kaizer Chiefs Away Jersey", team: "Kaizer Chiefs", price: 899, category: "psl", image: "KC-J2.jpg"},
    {id: 6, name: "Mamelodi Sundowns Home Jersey", team: "Sundowns", price: 899, category: "psl", image: "SD-J.jpg"},
    {id: 7, name: "Orlando Pirates Home Jersey", team: "Orlando Pirates", price: 899, category: "psl", image: "OP-J.jpg"},
    {id: 8, name: "Man City Home Jersey", team: "Man City", price: 1299, category: "international", image: "MC-J.jpg"}
];

    // =========================
// TEAM DATA
// =========================
const teams = [
    {name: "PSG", logo: "PSG-LOGO.png"},
    {name: "Real Madrid", logo: "RM-LOGO.png"},
    {name: "Barcelona", logo: "FCB-LOGO.png"},
    {name: "Liverpool", logo: "LFC-LOGO.png"},
    {name: "Man City", logo: "MC-LOGO.png"},
    {name: "Orlando Pirates", logo: "OP-LOGO.jpg"},
    {name: "Sundowns", logo: "SD-LOGO.jpg"},
    {name: "Kaizer Chiefs", logo: "KC-LOGO.jpg"}
];

    // =========================
    // CART
    // =========================
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // =========================
    // CART PANEL
    // =========================
    openCartBtn.addEventListener("click", () => cartPanel.classList.add("active"));
    closeCartBtn.addEventListener("click", () => cartPanel.classList.remove("active"));

    function showNotification(msg) {
        if(!notification) return;
        notification.textContent = msg;
        notification.classList.add("show");
        setTimeout(() => notification.classList.remove("show"), 2000);
    }

    // =========================
    // RENDER PRODUCTS
    // =========================
    function renderProducts(filterTeam = null, category = "all") {
        productsGrid.innerHTML = "";
        let filtered = products;

        if(category !== "all") filtered = filtered.filter(p => p.category === category);
        if(filterTeam) filtered = filtered.filter(p => p.team === filterTeam);

        filtered.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>R ${product.price}</p>
                <button data-id="${product.id}">Add to cart</button>
            `;
            card.querySelector("button").addEventListener("click", () => {
                addToCart(product.id);
                showNotification(`${product.name} added to cart!`);
            });
            productsGrid.appendChild(card);
        });
    }

    renderProducts();

    // =========================
    // ADD TO CART
    // =========================
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existing = cart.find(i => i.id === productId);
        if(existing) {
            existing.qty += 1;
        } else {
            cart.push({...product, qty: 1});
        }
        saveCart();
        renderCart();
    }

    // =========================
    // RENDER CART
    // =========================
    function renderCart() {
        cartItemsContainer.innerHTML = "";
        if(cart.length === 0){
            cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty ⚽</p>`;
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            cart.forEach(item => {
                const div = document.createElement("div");
                div.className = "cart-item";
                div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-info">
                        <h4>${item.name}</h4>
                        <p>R ${item.price}</p>
                        <div class="qty-control">
                            <button class="decrease" data-id="${item.id}">-</button>
                            <span>${item.qty}</span>
                            <button class="increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
        const tax = +(subtotal * 0.15).toFixed(2);
        const shipping = cart.length > 0 ? 5 : 0;
        subtotalEl.textContent = `R ${subtotal.toFixed(2)}`;
        taxEl.textContent = `R ${tax.toFixed(2)}`;
        totalEl.textContent = `R ${(subtotal + tax + shipping).toFixed(2)}`;
        cartCount.textContent = cart.reduce((acc,i)=>acc+i.qty,0);
    }

    renderCart();

    // =========================
    // CART ACTIONS
    // =========================
    cartItemsContainer.addEventListener("click", (e)=>{
        const id = parseInt(e.target.dataset.id);
        if(e.target.classList.contains("increase")){
            cart = cart.map(i=> i.id===id ? {...i, qty: i.qty+1} : i);
        }
        if(e.target.classList.contains("decrease")){
            cart = cart.map(i=> i.id===id ? {...i, qty: i.qty-1} : i).filter(i=> i.qty>0);
        }
        if(e.target.closest(".remove-item")){
            cart = cart.filter(i=> i.id!==id);
        }
        saveCart();
        renderCart();
    });

    // =========================
    // CATEGORY FILTER
    // =========================
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderProducts(null, button.dataset.category);
        });
    });

    // =========================
    // RENDER TEAMS
    // =========================
    function renderTeams() {
        teamsGrid.innerHTML = "";
        teams.forEach(team => {
            const div = document.createElement("div");
            div.className = "team-card";
            div.innerHTML = `<img src="${team.logo}" alt="${team.name}" data-team="${team.name}">`;
            div.querySelector("img").addEventListener("click", (e)=>{
                const teamName = e.target.dataset.team;
                categoryButtons.forEach(btn => btn.classList.remove("active"));
                renderProducts(teamName); // filter by team
            });
            teamsGrid.appendChild(div);
        });
    }

    renderTeams();

});
