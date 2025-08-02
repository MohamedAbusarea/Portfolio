const list = document.querySelector(".list");
const icon = document.querySelector(".icon_nav");

document.querySelector(".icon_nav").addEventListener("click", () => {
  const isOpen = list.classList.contains('opacity-100');

  if (isOpen) {
    list.classList.remove('opacity-100', 'max-h-[100%]');
    list.classList.add('opacity-0', 'max-h-0');
    icon.classList.remove("-rotate-90");
    icon.classList.add("rotate-0");
  } else {
    list.classList.remove('opacity-0', 'max-h-0');
    list.classList.add('opacity-100', 'max-h-[100%]');
    icon.classList.remove("rotate-0");
    icon.classList.add("-rotate-90");
  }
});




AOS.init();