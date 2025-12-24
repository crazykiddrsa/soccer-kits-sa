// ===========================
// Soccer Kits SA - Full Script.js
// ===========================
document.addEventListener("DOMContentLoaded", () => {
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

    const products = [
        {id: 1, name: "PSG Away Jersey", team: "PSG", price: 1199, category: "international", image: "PSG-J2.jpg"},
        {id: 2, name: "Real Madrid Away Jersey", team: "Real Madrid", price: 1249, category: "international", image: "RM-J2.jpg"},
        {id: 3, name: "Mamelodi Sundowns Home Jersey", team: "Sundowns", price: 899, category: "psl", image: "SD-J.jpg"}
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Open/close cart panel
    openCartBtn.addEventListener("click", () => cartPanel.classList.add("active"));
    closeCartBtn.addEventListener("click", () => cartPanel.classList.remove("active"));

    function showNotification(msg){
        notification.textContent = msg;
        notification.classList.add("show");
        setTimeout(()=> notification.classList.remove("show"), 2000);
    }

    function animateCart(){
        openCartBtn.classList.add("bounce");
        setTimeout(()=> openCartBtn.classList.remove("bounce"), 500);
    }

    function renderProducts(category="all"){
        productsGrid.innerHTML="";
        const filtered = category==="all" ? products : products.filter(p=>p.category===category);
        filtered.forEach(product=>{
            const card = document.createElement("div");
            card.className="product-card";
            card.innerHTML=`
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>R ${product.price}</p>
                <button data-id="${product.id}">Add to cart</button>
            `;
            card.querySelector("button").addEventListener("click", ()=>{
                addToCart(product.id);
                showNotification(`${product.name} added to cart!`);
                animateCart();
            });
            productsGrid.appendChild(card);
        });
    }
    renderProducts();

    function addToCart(id){
        const product = products.find(p=>p.id===id);
        const exist = cart.find(i=>i.id===id);
        if(exist) exist.qty++;
        else cart.push({...product, qty:1});
        saveCart(); renderCart();
    }

    function saveCart(){ localStorage.setItem("cart", JSON.stringify(cart)); }

    function renderCart(){
        cartItemsContainer.innerHTML="";
        if(cart.length===0){
            cartItemsContainer.innerHTML=`<p class="empty-cart">Your cart is empty ⚽</p>`;
            checkoutBtn.disabled=true;
        } else {
            checkoutBtn.disabled=false;
            cart.forEach(item=>{
                const div=document.createElement("div");
                div.className="cart-item";
                div.innerHTML=`
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
        const subtotal = cart.reduce((acc,i)=>acc+i.price*i.qty,0);
        const tax = +(subtotal*0.15).toFixed(2);
        const shipping = cart.length>0 ? 5:0;
        subtotalEl.textContent=`R ${subtotal.toFixed(2)}`;
        taxEl.textContent=`R ${tax.toFixed(2)}`;
        totalEl.textContent=`R ${(subtotal+tax+shipping).toFixed(2)}`;
        cartCount.textContent=cart.reduce((acc,i)=>acc+i.qty,0);
    }

    renderCart();

    // Cart actions
    cartItemsContainer.addEventListener("click",(e)=>{
        const id=parseInt(e.target.dataset.id);
        if(e.target.classList.contains("increase")) cart=cart.map(i=>i.id===id?{...i,qty:i.qty+1}:i);
        if(e.target.classList.contains("decrease")) cart=cart.map(i=>i.id===id?{...i,qty:i.qty-1}:i).filter(i=>i.qty>0);
        if(e.target.closest(".remove-item")) cart=cart.filter(i=>i.id!==id);
        saveCart(); renderCart();
    });

    // Category filter
    document.querySelectorAll(".category-btn").forEach(btn=>{
        btn.addEventListener("click", ()=>{
            document.querySelectorAll(".category-btn").forEach(b=>b.classList.remove("active"));
            btn.classList.add("active");
            renderProducts(btn.dataset.category);
        });
    });
});
