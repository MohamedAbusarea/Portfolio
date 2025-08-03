function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
}

document.getElementById("bars").addEventListener("click", toggleMenu);
