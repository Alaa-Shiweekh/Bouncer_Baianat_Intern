document.addEventListener("DOMContentLoaded", function () {
    const currencyOptions = document.querySelectorAll(".currency-option");
    const LangOptions = document.querySelectorAll(".lang-option");
    const selectedCurrency = document.getElementById("selected-currency");
    const selectedLang = document.getElementById("selected-lang");

    currencyOptions.forEach(option => {
        option.addEventListener("click", function (event) {
            event.preventDefault(); // منع السلوك الافتراضي للرابط
            const selectedValue = this.getAttribute("data-value"); // الحصول على القيمة المحددة
            selectedCurrency.textContent = selectedValue; // تحديث النص في العنصر
        });
    });
    LangOptions.forEach(option => {
        option.addEventListener("click", function (event) {
            event.preventDefault(); // منع السلوك الافتراضي للرابط
            const selectedValue = this.getAttribute("data-value"); // الحصول على القيمة المحددة
            selectedLang.textContent = selectedValue; // تحديث النص في العنصر
        });
    });
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const productRow = document.querySelector(".best_seller .container .row");
    const categoryLinks = document.querySelectorAll(".best_seller > div a");
    const cartCount = document.querySelector(".cart-count");
    const searchIcon = document.getElementById("searchIcon");
    const searchContainer = document.getElementById("searchContainer");
    const searchInput = document.getElementById("searchInput");
    const closeSearch = document.getElementById("closeSearch");
    const searchResults = document.getElementById("searchResults");
    const itemsLink = document.querySelector(".cart-link");
    const loadMoreButton = document.querySelector(".load");

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    let currentProducts = [];
    let currentIndex = 0;
    const productsPerPage = 4;

    if (!localStorage.getItem("hidePopup")) {
        popup.style.display = "block";
        overlay.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    document.querySelector(".close-btn").addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none";
        document.body.style.overflow = "auto";
    });

    async function fetchProducts(category) {
        let url = category.toLowerCase() === "all"
            ? "https://fakestoreapi.com/products"
            : `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;
        try {
            const res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    function renderProducts(products) {
        productRow.innerHTML = "";
        currentProducts = products;
        currentIndex = 0;
        loadMoreProducts();
    }

    function loadMoreProducts() {
        const productsToShow = currentProducts.slice(currentIndex, currentIndex + productsPerPage);
        productsToShow.forEach(product => {
            const safeTitle = product.title.replace(/"/g, '&quot;');
            productRow.innerHTML += `
                <div class="col-3">
                    <div class="card">
                        <div class="image-container">
                            <a href="product.html?id=${product.id}">
                            <img src="${product.image}" class="card-img-top imgc1" alt="${safeTitle}">
                            </a>  
                            <div class="overlay">
                                <div class="icons">
                                    <div class="icon-circle add-to-cart">
                                        <img src="assets/cart_2.svg" alt="Add to Cart" class="icon">
                                    </div>
                                    <div class="icon-circle add-to-wishlist">
                                        <img src="assets/heart-regular.svg" alt="Add to Wishlist" class="icon">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="card-body">
                            <h6 class="card-text" title="${safeTitle}">
                                <a href="product.html?id=${product.id}" class="product-link" title="${product.title}">${product.title}</a>
                            </h6>
                            <div class="rating"><img src="assets/rate.svg" alt="Rating"></div>
                            <p class="price"><span>$${product.price}</span></p>
                        </div>
                    </div>
                </div>`;
        });
        currentIndex += productsPerPage;
        loadMoreButton.style.display = currentIndex >= currentProducts.length ? "none" : "block";
    }

    document.querySelector(".best_seller > div a").classList.add("active");

    categoryLinks.forEach(link => {
        link.addEventListener("click", async function (event) {
            event.preventDefault();
    
            // 🔹 إزالة الـ active من جميع الروابط وإضافة لها الرابط الحالي
            categoryLinks.forEach(link => link.classList.remove("active"));
            this.classList.add("active");
    
            // 🔹 جلب المنتجات للفئة المحددة
            const category = this.getAttribute("data-category");
            const products = await fetchProducts(category);
            
            // 🔹 تحديث عرض المنتجات في قسم Best Seller
            renderProducts(products);
        });
    });
    
    
    
    async function init() {
        const initialProducts = await fetchProducts("all");
        renderProducts(initialProducts);
    }
    init();

    function updateCartCount() {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        cartCount.textContent = cartItems.length ? `${cartItems.length} items` : "0 items";
    }

    document.addEventListener("click", function (event) {
        if (event.target.closest(".add-to-cart")) {
            const card = event.target.closest(".card");
            const product = {
                title: card.querySelector(".card-text").textContent,
                price: card.querySelector(".price span").textContent,
                image: card.querySelector(".card-img-top").src
            };
            cartItems.push(product);
            updateCartCount();
        }

        if (event.target.closest(".add-to-wishlist")) {
            const icon = event.target.closest(".add-to-wishlist").querySelector(".icon");

            // إضافة أو إزالة الكلاس "active" فقط على الأيقونة
            icon.classList.toggle("active");

            const card = event.target.closest(".card");
            const product = {
                title: card.querySelector(".card-text").textContent,
                price: card.querySelector(".price span").textContent,
                image: card.querySelector(".card-img-top").src
            };
            wishlistItems.push(product);
            localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
        }
    });

    itemsLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "cart.html";
    });

    searchIcon.addEventListener("click", function (event) {
        event.preventDefault();
        searchContainer.style.display = "flex";
        searchIcon.style.display = "none";
        searchInput.focus();
    });

    closeSearch.addEventListener("click", function (event) {
        event.preventDefault();
        searchContainer.style.display = "none";
        searchIcon.style.display = "block";
        searchInput.value = "";
        searchResults.style.display = "none";
    });

    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter" && searchInput.value.trim()) {
            event.preventDefault();
            searchProducts(searchInput.value.trim());
        }
    });

    function searchProducts(query) {
        searchResults.innerHTML = "";
        let found = false;
        document.querySelectorAll(".card-text").forEach(item => {
            if (item.textContent.toLowerCase().includes(query.toLowerCase())) {
                found = true;
                searchResults.innerHTML += `<div>${item.textContent}</div>`;
            }
        });
        searchResults.style.display = found ? "block" : "none";
    }

    loadMoreButton.addEventListener("click", function (event) {
        event.preventDefault();
        loadMoreProducts();
    });

    updateCartCount();
});

document.addEventListener("DOMContentLoaded", function () {
    const cartCount = document.querySelector(".cart-count");
    const itemsLink = document.querySelector(".cart-link");
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCount() {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        cartCount.textContent = cartItems.length ? `${cartItems.length} items` : "0 items";
    }

    document.addEventListener("click", function (event) {
        if (event.target.closest(".add-to-cart")) {
            const card = event.target.closest(".card");
            const product = {
                title: card.querySelector(".card-text, h5").textContent,
                price: card.querySelector(".price span").textContent,
                image: card.querySelector(".card-img-top, .img-fluid").src
            };
            cartItems.push(product);
            updateCartCount();
        }
    });

    itemsLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "cart.html";
    });

    updateCartCount();
});

async function fetchProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const products = await fetchProducts();
    renderProducts(products.slice(0, 3));
});

function renderProducts(products) {
    const productRow = document.getElementById("featuredProductsRow");
    productRow.innerHTML = "";

    products.forEach(product => {
        const productCard = `
            <div class="col">
                <div class="card mb-3 c1">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <a href="product.html?id=${product.id}">
                            </a>
                            <img src="${product.image}" class="img-fluid rounded-start im1" alt="${product.title}">
 
                            <div class="overlay">
                                <div class="icons">
                                    <div class="icon-circle add-to-cart">
                                        <img src="assets/cart_2.svg" alt="Add to Cart" class="icon">
                                    </div>
                                    <div class="icon-circle add-to-wishlist">
                                        <img src="assets/heart-regular.svg" alt="Add to Wishlist" class="icon">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 title="${product.title}">
                                   <a href="product.html?id=${product.id}" class="product-link" title="${product.title}">${product.title}</a>
                                </h5>
                                <div class="rating"><img src="assets/rate.svg" alt="rating"></div>
                                <p class="price"><span>$${product.price}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productRow.innerHTML += productCard;
    });
}
