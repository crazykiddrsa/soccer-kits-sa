// ===========================
// Soccer Kits SA - Full Script.js with Cart Bounce
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
    const checkoutModal = document.getElementById("checkoutModal");
    const confirmationModal = document.getElementById("confirmationModal");
    const closeModalBtns = document.querySelectorAll(".close-modal");
    const eftDetails = document.getElementById("eftDetails");
    const notification = document.getElementById("cartNotification"); // new div for messages

    // =========================
    // PRODUCT DATA
    // =========================
    const products = [
        {id: 1, name: "PSG Away Jersey", team: "PSG", price: 1199, category: "international", image: "PSG-J2.jpg"},
        {id: 2, name: "Real Madrid Away Jersey", team: "Real Madrid", price: 1249, category: "international", image: "RM-J2.jpg"},
        {id: 3, name: "Mamelodi Sundowns Home Jersey", team: "Sundowns", price: 899, category: "psl", image: "SD-J.jpg"}
    ];

    // =========================
    // LOAD CART FROM LOCALSTORAGE
    // =========================
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // =========================
    // OPEN/CLOSE CART PANEL
    // =========================
    openCartBtn.addEventListener("click", () => cartPanel.classList.add("active"));
    closeCartBtn.addEventListener("click", () => cartPanel.classList.remove("active"));

    // =========================
    // SHOW TEMP NOTIFICATION
    // =========================
    function showNotification(msg) {
        if(!notification) return;
        notification.textContent = msg;
        notification.classList.add("show");
        setTimeout(()=> notification.classList.remove("show"), 2000);
    }

    // =========================
    // RENDER PRODUCTS GRID
    // =========================
    function renderProducts(category = "all") {
        productsGrid.innerHTML = "";
        const filtered = category === "all" ? products : products.filter(p => p.category === category);
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
                bounceCartIcon();
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
    // SAVE CART
    // =========================
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // =========================
    // RENDER CART PANEL
    // =========================
    function renderCart() {
        if(!cartItemsContainer) return;
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
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderProducts(button.dataset.category);
        });
    });

    // =========================
    // CHECKOUT MODAL
    // =========================
    if(checkoutBtn) {
        checkoutBtn.addEventListener("click", ()=> checkoutModal.style.display="block");
    }
    closeModalBtns.forEach(btn => btn.addEventListener("click", ()=> checkoutModal.style.display="none"));

    document.querySelectorAll('input[name="payment"]').forEach(radio=>{
        radio.addEventListener("change", e=>{
            eftDetails.style.display = e.target.value==="eft" ? "block" : "none";
        });
    });

    const checkoutForm = document.getElementById("checkoutForm");
    if(checkoutForm) {
        checkoutForm.addEventListener("submit", (e)=>{
            e.preventDefault();
            checkoutModal.style.display="none";
            confirmationModal.style.display="block";
            document.getElementById("orderTotal").textContent = totalEl.textContent;
            document.getElementById("paymentMethod").textContent = document.querySelector('input[name="payment"]:checked').nextElementSibling.querySelector("h4").textContent;
            cart = [];
            saveCart();
            renderCart();
        });
    }

    document.getElementById("continueShopping")?.addEventListener("click", ()=> confirmationModal.style.display="none");
    document.getElementById("printReceipt")?.addEventListener("click", ()=> window.print());

    window.addEventListener("click", (e)=>{
        if(e.target === checkoutModal) checkoutModal.style.display="none";
        if(e.target === confirmationModal) confirmationModal.style.display="none";
    });

    // =========================
    // CART ICON BOUNCE FUNCTION
    // =========================
    function bounceCartIcon() {
        openCartBtn.classList.add("bounce");
        setTimeout(()=> openCartBtn.classList.remove("bounce"), 500);
    }

});
