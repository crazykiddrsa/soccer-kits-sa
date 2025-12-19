// Product & Team data, Cart functions, Render functions...
// (Keep your previous JS, but remove any line with `reference`)

// Example fix in submitOrder()
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
        showNotification('Please fill in all required fields');
        return;
    }

    // Order logic continues...
}
