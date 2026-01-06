import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyA1fzS6xJm1sXi8rJs6s5NwD0HIv38GAz4",
  authDomain: "clone-f5c60.firebaseapp.com",
  projectId: "clone-f5c60",
  storageBucket: "clone-f5c60.firebasestorage.app",
  messagingSenderId: "658257438148",
  appId: "1:658257438148:web:42e7631ac54c4c9ce1f091",
  measurementId: "G-VDM4M6FZ0G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const adminEmails = ["molla@gmail.com"];

const loginForm = document.querySelector("#loginForm");
const productForm = document.querySelector("#productForm");
const productListDiv = document.querySelector("#productList");

let idToken = ""; 


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!adminEmails.includes(user.email)) {
      alert("You are logged in, but NOT an admin!");
      return;
    }


    idToken = await user.getIdToken();

    alert(`Logged in as admin: ${user.email}`);
    loginForm.style.display = "none";
    productForm.style.display = "block";


    fetchProducts();

  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
});


async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:4001/products", {
      headers: { Authorization: `Bearer ${idToken}` } // include token
    });
    const products = await res.json();

    productListDiv.innerHTML = "";
    if (!products.length) {
      productListDiv.innerHTML = "<p>No products found.</p>";
      return;
    }

    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <h3>${p.title}</h3>
        <p><strong>Category:</strong> ${p.category}</p>
        <p><strong>Price:</strong> $${p.price}</p>
        <p><strong>Description:</strong> ${p.description}</p>
        <p><strong>Rating:</strong> ${p.rating.rate} (${p.rating.count})</p>
        <img src="${p.image}" alt="${p.title}" style="max-width:150px;"><br>
        <button type="button" class="update-btn" data-id="${p.id}">Update</button>
        <button type="button" class="delete-btn" data-id="${p.id}">Delete</button>
        <hr>
      `;
      productListDiv.appendChild(div);
    });


    productListDiv.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("Are you sure you want to delete this product?")) {
          await deleteProduct(id);
        }
      });
    });


    productListDiv.querySelectorAll(".update-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const product = products.find(p => p.id == id);
        populateFormForUpdate(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    productListDiv.innerHTML = "<p>Error loading products.</p>";
  }
}


async function deleteProduct(id) {
  try {
    await fetch(`http://localhost:4001/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${idToken}` }
    });
    alert("Product deleted!");
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Failed to delete product");
  }
}


function populateFormForUpdate(product) {
  productForm.style.display = "block";
  loginForm.style.display = "none";

  productForm.dataset.updateId = product.id;
  productForm.title.value = product.title;
  productForm.category.value = product.category;
  productForm.image.value = product.image;
  productForm.description.value = product.description;
  productForm.price.value = product.price;
  productForm.rate.value = product.rating.rate;
  productForm.count.value = product.rating.count;
}


productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  if (data.price) data.price = parseFloat(data.price);
  if (data.rate) data.rate = parseFloat(data.rate);
  if (data.count) data.count = parseInt(data.count);

  const updateId = productForm.dataset.updateId;
  const url = updateId ? `http://localhost:4001/products/${updateId}` : "http://localhost:4001/add-products";
  const method = updateId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}` 
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(updateId ? "Product updated!" : "Product added!");
    productForm.reset();
    delete productForm.dataset.updateId;
    await fetchProducts();
     window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    alert("Failed to submit product");
  }
});
