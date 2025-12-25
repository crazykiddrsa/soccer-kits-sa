// =====================
// GOOGLE ADSENSE INIT
// =====================

// Ensures all manual ad blocks are initialized
(window.adsbygoogle = window.adsbygoogle || []).push({});

// =====================
// OPTIONAL: DOM READY FUNCTIONS
// =====================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Soccer Kits SA: Page loaded successfully.");

    // Example: hover effect for jersey cards (extra JS in case CSS hover is disabled)
    const jerseys = document.querySelectorAll(".jersey");
    jerseys.forEach(jersey => {
        jersey.addEventListener("mouseenter", () => {
            jersey.style.transform = "translateY(-5px)";
            jersey.style.boxShadow = "0 8px 12px rgba(0,0,0,0.2)";
        });
        jersey.addEventListener("mouseleave", () => {
            jersey.style.transform = "translateY(0)";
            jersey.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        });
    });

    // Future enhancement: add click event for "Buy Now" buttons if added later
    const buyButtons = document.querySelectorAll("button.buy-now");
    buyButtons.forEach(button => {
        button.addEventListener("click", () => {
            alert("Redirecting to checkout...");
            // Add actual checkout link here
        });
    });
});
