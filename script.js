document.addEventListener("DOMContentLoaded", ()=>{

// Elements
const productsGrid=document.getElementById("productsGrid");
const teamsGrid=document.getElementById("teamsGrid");
const cartCount=document.getElementById("cartCount");
const cartPanel=document.getElementById("cartPanel");
const openCartBtn=document.getElementById("cartBtn");
const closeCartBtn=document.getElementById("closeCart");
const cartItemsContainer=document.getElementById("cartItems");
const subtotalEl=document.getElementById("subtotal");
const taxEl=document.getElementById("tax");
const totalEl=document.getElementById("total");
const checkoutBtn=document.getElementById("checkoutBtn");
const notification=document.getElementById("cartNotification");
const categoryButtons=document.querySelectorAll(".category-btn");

// Products & Teams
const products=[
{id:1,name:"PSG Away Jersey",team:"PSG",price:1199,category:"international",image:"PSG-J2.jpg"},
{id:2,name:"Real Madrid Away Jersey",team:"Real Madrid",price:1249,category:"international",image:"RM-J2.jpg"},
{id:3,name:"Mamelodi Sundowns Home Jersey",team:"Sundowns",price:899,category:"psl",image:"SD-J.jpg"},
{id:4,name:"Barcelona Away Jersey",team:"Barcelona",price:1299,category:"international",image:"FCB-J2.jpg"},
{id:5,name:"Kaizer Chiefs Away Jersey",team:"Kaizer Chiefs",price:999,category:"psl",image:"KC-J2.jpg"},
{id:6,name:"Liverpool Home Jersey",team:"Liverpool",price:1099,category:"international",image:"LFC-J.jpg"},
{id:7,name:"Orlando Pirates Home Jersey",team:"Orlando Pirates",price:899,category:"psl",image:"OP-J.jpg"}
];

const teams=[
{name:"PSG",image:"PSG-LOGO.jpg"},
{name:"Real Madrid",image:"RM-LOGO.jpg"},
{name:"Mamelodi Sundowns",image:"SD-LOGO.jpg"},
{name:"Barcelona",image:"FCB-LOGO.jpg"},
{name:"Kaizer Chiefs",image:"KC-LOGO.jpg"},
{name:"Liverpool",image:"LFC-LOGO.jpg"},
{name:"Orlando Pirates",image:"OP-LOGO.jpg"},
{name:"Man City",image:"MC-LOGO.jpg"}
];

let cart=JSON.parse(localStorage.getItem("cart"))||[];

// Open/Close Cart
openCartBtn.addEventListener("click",()=>{cartPanel.classList.add("active");});
closeCartBtn.addEventListener("click",()=>{cartPanel.classList.remove("active");});

// Notification
function showNotification(msg){
    notification.textContent=msg;
    notification.classList.add("show");
    setTimeout(()=>notification.classList.remove("show"),2000);
}

// Render Products
function renderProducts(category="all"){
    productsGrid.innerHTML="";
    let filtered=category==="all"?products:products.filter(p=>p.category===category);
    filtered.forEach(p=>{
        const card=document.createElement("div");
        card.className="product-card";
        card.innerHTML=`<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><p>R ${p.price}</p><button data-id="${p.id}">Add to cart</button>`;
        card.querySelector("button").addEventListener("click",()=>{
            addToCart(p.id);
            showNotification(`${p.name} added to cart!`);
        });
        productsGrid.appendChild(card);
    });
}

// Render Products By Team
function renderProductsByTeam(teamName){
    productsGrid.innerHTML="";
    let filtered=products.filter(p=>p.team===teamName);
    filtered.forEach(p=>{
        const card=document.createElement("div");
        card.className="product-card";
        card.innerHTML=`<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><p>R ${p.price}</p><button data-id="${p.id}">Add to cart</button>`;
        card.querySelector("button").addEventListener("click",()=>{
            addToCart(p.id);
            showNotification(`${p.name} added to cart!`);
        });
        productsGrid.appendChild(card);
    });
}

// Render Teams
function renderTeams(){
    teamsGrid.innerHTML="";
    teams.forEach(t=>{
        const div=document.createElement("div");
        div.className="team-logo-card";
        div.innerHTML=`<img src="${t.image}" alt="${t.name}"><p>${t.name}</p>`;
        div.addEventListener("click",()=>{renderProductsByTeam(t.name);});
        teamsGrid.appendChild(div);
    });
}

// Cart Functions
function addToCart(productId){
    const product=products.find(p=>p.id===productId);
    const existing=cart.find(i=>i.id===productId);
    if(existing){existing.qty+=1;}else{cart.push({...product,qty:1});}
    saveCart(); renderCart(); bounceCartIcon();
}

function saveCart(){localStorage.setItem("cart",JSON.stringify(cart));}

function renderCart(){
    cartItemsContainer.innerHTML="";
    if(cart.length===0){
        cartItemsContainer.innerHTML=`<p class="empty-cart">Your cart is empty ⚽</p>`;
        checkoutBtn.disabled=true;
    }else{
        checkoutBtn.disabled=false;
        cart.forEach(item=>{
            const div=document.createElement("div");
            div.className="cart-item";
            div.innerHTML=`<img src="${item.image}" alt="${item.name}"><div class="cart-info"><h4>${item.name}</h4><p>R ${item.price}</p><div class="qty-control"><button class="decrease" data-id="${item.id}">-</button><span>${item.qty}</span><button class="increase" data-id="${item.id}">+</button></div></div><button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>`;
            cartItemsContainer.appendChild(div);
        });
    }
    const subtotal=cart.reduce((acc,i)=>acc+i.price*i.qty,0);
    const tax=+(subtotal*0.15).toFixed(2);
    const shipping=cart.length>0?5:0;
    subtotalEl.textContent=`R ${subtotal.toFixed(2)}`;
    taxEl.textContent=`R ${tax.toFixed(2)}`;
    totalEl.textContent=`R ${(subtotal+tax+shipping).toFixed(2)}`;
    cartCount.textContent=cart.reduce((acc,i)=>acc+i.qty,0);
}

// Cart Quantity Actions
cartItemsContainer.addEventListener("click",(e)=>{
    const id=parseInt(e.target.dataset.id);
    if(e.target.classList.contains("increase")){cart=cart.map(i=>i.id===id?{...i,qty:i.qty+1}:i);}
    if(e.target.classList.contains("decrease")){cart=cart.map(i=>i.id===id?{...i,qty:i.qty-1}:i).filter(i=>i.qty>0);}
    if(e.target
