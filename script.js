// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: "PSG 2023/24 Home Jersey",
        team: "Paris Saint-Germain",
        price: 1299.99,
        oldPrice: 1499.99,
        category: "international",
        badge: "Popular",
        teamColor: "#004170",
        <img src="Screenshot_20251219_015119_Bash.jpg" alt="Home kit">
        sizes: ["S", "M", "L", "XL"]
    },
    // ... include all your other products here
];

// ===== TEAMS DATA =====
const teams = [
    { name: "Paris Saint-Germain", league: "Ligue 1", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png" },
    // ... include other teams
];

// ===== CART FUNCTIONALITY =====
let cart = [];
const SHIPPING_COST = 99.00;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const teamsGrid = document.getElementById('teamsGrid');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const cartItemsContainer = document.getElementById('cartItems');
const checkoutItemsContainer = document.getElementById('checkoutItems');
const cartSubtotalElement = document.getElementById('cartSubtotal');
const cartShippingElement = document.getElementById('cartShipping');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutTotalElement = document.getElementById('checkoutTotal');
const cartCountElement = document.getElementById('cartCount');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const clearCartBtn = document.getElementById('clearCart');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const categoryButtons = document.querySelectorAll('.category-btn');
const checkoutForm = document.getElementById('checkoutForm');
const paymentOptions = document.querySelectorAll('.payment-option');

// ===== INITIALIZE PAGE =====
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    renderTeams();
    updateCartCount();
    
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('soccerKitsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
    
    setupEventListeners();
});

// ===== RENDER PRODUCTS =====
function renderProducts(filterCategory = "all") {
    productsGrid.innerHTML = '';
    
    const filteredProducts = filterCategory === "all" 
        ? products 
        : products.filter(product => product.category === filterCategory);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        const sizeButtons = product.sizes.map(size => 
            `<button class="size-btn" data-size="${size}">${size}</button>`
        ).join('');
        
        productCard.innerHTML = `
            <div class="product-image">
                <div class="product-badge">${product.badge}</div>
                <img src="${product.image}" alt="${product.name}" class="jersey-img">
                <div class="team-logo-small" style="background-color: ${product.teamColor};">
                    <img src="${product.logo}" alt="${product.team} logo">
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-team">
                    <img src="${product.logo}" alt="${product.team}" style="width: 20px; height: 20px;">
                    ${product.team}
                </div>
                <div class="sizes">
                    ${sizeButtons}
                </div>
                <div class="product-price">
                    <div>
                        ${product.oldPrice ? `<span class="old-price">R ${product.oldPrice.toFixed(2)}</span>` : ''}
                        <span class="price">R ${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
        
        const sizeBtns = productCard.querySelectorAll('.size-btn');
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                sizeBtns.forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const productCard = this.closest('.product-card');
            const selectedSize = productCard.querySelector('.size-btn.selected');
            
            if (!selectedSize) {
                showNotification('Please select a size before adding to cart');
                return;
            }
            
            addToCart(productId, selectedSize.getAttribute('data-size'));
        });
    });
}

// ===== RENDER TEAMS =====
function renderTeams() {
    teamsGrid.innerHTML = '';
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <div class="team-logo">
                <img src="${team.logo}" alt="${team.name} logo">
            </div>
            <div class="team-name">${team.name}</div>
            <div class="team-league">${team.league}</div>
        `;
        teamsGrid.appendChild(teamCard);
    });
}

// ===== CART FUNCTIONS =====
function addToCart(productId, size) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            team: product.team,
            price: product.price,
            size: size,
            image: product.image,
            logo: product.logo,
            quantity: 1
        });
    }
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();
    showNotification(`${product.name} (${size}) added to cart!`);
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartSubtotalElement.textContent = 'R 0.00';
        cartShippingElement.textContent = 'R 0.00';
        cartTotalElement.textContent = 'R 0.00';
        checkoutBtn.disabled = true;
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    checkoutBtn.disabled = false;
    
    let subtotal = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-details">
                    ${item.team} | Size: ${item.size}
                </div>
                <div class="cart-item-price">R ${itemTotal.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    const shipping = subtotal > 0 ? SHIPPING_COST : 0;
    const total = subtotal + shipping;
    
    cartSubtotalElement.textContent = `R ${subtotal.toFixed(2)}`;
    cartShippingElement.textContent = `R ${shipping.toFixed(2)}`;
    cartTotalElement.textContent = `R ${total.toFixed(2)}`;
    
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const action = this.getAttribute('data-action');
            updateQuantity(index, action);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

function updateQuantity(index, action) {
    if (index < 0 || index >= cart.length) return;
    if (action === 'increase') cart[index].quantity += 1;
    if (action === 'decrease') {
        if (cart[index].quantity > 1) cart[index].quantity -= 1;
        else return removeFromCart(index);
    }
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    const removedItem = cart.splice(index, 1)[0];
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();
    showNotification(`${removedItem.name} removed from cart`);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

function saveCartToLocalStorage() {
    localStorage.setItem('soccerKitsCart', JSON.stringify(cart));
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartDisplay();
        updateCartCount();
        saveCartToLocalStorage();
        showNotification('Cart cleared!');
    }
}

// ===== CHECKOUT FUNCTIONS =====
function openCheckout() {
    if (cart.length === 0) return showNotification('Your cart is empty!');
    
    checkoutItemsContainer.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `<span>${item.name} (${item.size}) x${item.quantity}</span><span>R ${itemTotal.toFixed(2)}</span>`;
        checkoutItemsContainer.appendChild(checkoutItem);
    });
    
    const shipping = SHIPPING_COST;
    const total = subtotal + shipping;
    const shippingItem = document.createElement('div');
    shippingItem.className = 'checkout-item';
    shippingItem.innerHTML = `<span>Shipping</span><span>R ${shipping.toFixed(2)}</span>`;
    checkoutItemsContainer.appendChild(shippingItem);
    
    checkoutTotalElement.textContent = `R ${total.toFixed(2)}`;
    checkoutModal.classList.add('active');
}

function submitOrder(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!fullName || !email || !phone || !address || !city || !postalCode || !paymentMethod) {
        return showNotification('Please fill in all required fields');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_COST;

    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: { fullName, email, phone, address, city, postalCode },
        paymentMethod,
        items: [...cart],
        subtotal,
        shipping: SHIPPING_COST,
        total,
        status: 'pending'
    };

    const orders = JSON.parse(localStorage.getItem('soccerKitsOrders') || '[]');
    orders.push(order);
    localStorage.setItem('soccerKitsOrders', JSON.stringify(orders));

    cart = [];
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();

    cartModal.classList.remove('active');
    checkoutModal.classList.remove('active');

    checkoutForm.reset();
    showNotification(`Order #${order.id} placed successfully!`);
    console.log('Order placed:', order);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    openCartBtn.addEventListener('click', e => { e.preventDefault(); cartModal.classList.add('active'); });
    closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));

    document.addEventListener('click', e => {
        if (e.target === cartModal) cartModal.classList.remove('active');
        if (e.target === checkoutModal) checkoutModal.classList.remove('active');
    });

    clearCartBtn.addEventListener('click', clearCart);

    mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
    document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));

    categoryButtons.forEach(button => button.addEventListener('click', function() {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        renderProducts(this.getAttribute('data-category'));
    }));

    paymentOptions.forEach(option => option.addEventListener('click', function() {
        paymentOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        document.getElementById('paymentMethod').value = this.getAttribute('data-method');
    }));

    checkoutForm.addEventListener('submit', submitOrder);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }));
}

// ===== HELPER =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
    }
