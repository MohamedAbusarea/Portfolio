// crud system
// get button
const dataInformatin = document.getElementById("dataInformatin");
const showData = document.getElementById("showData");
const showTransaction = document.getElementById("showTransaction");
const reset = document.getElementById("reset");

// get input
const Name = document.getElementById("name");
const amount = document.getElementById("amount");

// get alert
const alert = document.getElementById("alert");

// get element
const transaction = document.getElementById("transaction");

// add class style for validate
Name.addEventListener("input", (e) => {
  if (!CheckerName(Name.value.trim())) {
    Name.classList.remove("inpvalid");
    Name.classList.add("inpnotvalid");
  }
  if (Name.value == "" || CheckerName(Name.value.trim())) {
    Name.classList.add("inpvalid");
    Name.classList.remove("inpnotvalid");
  }
});

// when click on function get vale and trim
dataInformatin.addEventListener("submit", (e) => {
  e.preventDefault();
  let nameValue = Name.value.trim();
  let amountValue = amount.value.trim();
  if (CheckerName(nameValue, amountValue)) {
    dataStorge(nameValue, amountValue);
    showdata();
    Swal.fire({
      title: "Saved Successfully",
      icon: "success",
      draggable: true,
    });

    dataInformatin.reset();
  } else {
    showalert();
  }
});

// check validation name and amount
function CheckerName(Name) {
  //check name
  if (
    !Name ||
    Name.length == 0 ||
    Name.length < 2 ||
    !Name.split("").every((e) => {
      return e === " " ? true : isNaN(e);
    })
  ) {
    return false;
  } else {
    return true;
  }
}

// Show alert message
function showalert() {
  setTimeout(() => {
    alert.classList.remove("-top-12");
    alert.classList.add("top-12");
    alert.classList.remove("opacity-0");
    alert.classList.add("opacity-100");
  }, 0);

  setTimeout(() => {
    alert.classList.remove("opacity-100");
    alert.classList.add("opacity-0");
    alert.classList.remove("top-12");
    alert.classList.add("-top-12");
  }, 5000);
}

//

// add in local storg
function dataStorge(Name, amount, index) {
  let data = JSON.parse(localStorage.getItem("data")) || [];

  if (index >= 0) {
    data.splice(index, 1, { name: Name, amount: amount });
  } else {
    data.push({ name: Name, amount: amount });
  }
  localStorage.setItem("data", JSON.stringify(data));
}

// clear data
reset.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: "Clear all data",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Clear Successfully!",
        text: "All data has been deleted",
        icon: "success",
      });
      localStorage.clear();
      showdata();
    }
  });
});
showdata();
// show data
function showdata() {
  let data = JSON.parse(localStorage.getItem("data")) || [];

  let html = data
    .map((e, index) => {
      return `
               
        <tr class="divide-x divide-gray-200">
      <td i="${index}" n = "NameUser" class="px-4 py-2 text-sm text-gray-800 text-center">${e.name}</td>
      <td i="${index}" a = "AmountUser"  class="px-4 py-2 text-sm text-gray-800 text-center">${e.amount}</td>
      <td class="px-6 py-2 text-sm text-gray-800">
        <div SaveIndex = "${index}"  class="flex items-center justify-center gap-6">
          <i onclick='editUser(${index})'  class="cursor-pointer text-blue-500 hover:text-blue-700 fa-regular fa-pen-to-square"></i>
          <i onclick='deleteUser(${index})'  class="cursor-pointer text-red-500 hover:text-red-700 fa-solid fa-trash"></i>
        </div>
      </td>
    </tr>
        `;
    })
    .join("");
  transaction.innerHTML = html;
}

// delete

window.deleteUser = function deleteUser(i) {
  let data = JSON.parse(localStorage.getItem("data"));
  Swal.fire({
    title: "Are you sure?",
    text: "Dleate user!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Delete Successfully!",
        text: "User has been deleted",
        icon: "success",
      });
      data.splice(i, 1);
      localStorage.setItem("data", JSON.stringify(data));
      showdata();
    }
  });
};

// edit When click user shiw inputs to edit
function editUser(iUser) {
  let amount = document.querySelector(`[i="${iUser}"][a="AmountUser"]`);
  let Name = document.querySelector(`[i="${iUser}"][n="NameUser"]`);
  let SaveIndex = document.querySelector(`[SaveIndex="${iUser}"]`);

  let isEditing = amount.getAttribute("data-editing");

  if (isEditing !== "true") {
    amount.innerHTML = `
      <input 
        class='m-auto box-border inline-block w-[40%] border border-green-300 py-2 rounded-sm outline-blue-400 focus:!outline-blue-400 text-center'
        type="number"
        min="1000"
        value="${+amount.textContent}"
        
      >
    `;

    Name.innerHTML = `
      <input 
        class='m-auto box-border inline-block w-[55%] border border-green-300 text-center p-2 rounded-sm outline-blue-400 focus:!outline-blue-400'
        type="text"
        value="${Name.textContent.trim()}"
        
      >
    `;

    SaveIndex.insertAdjacentHTML(
      "afterbegin",
      `<i onclick='saveEditData(${iUser})' class=" box-border cursor-pointer text-green-500 hover:text-green-700 fa-solid fa-floppy-disk"></i>`
    );

    amount.setAttribute("data-editing", "true");
  } else {
    let amountInput = amount.querySelector("input");
    let NameInput = Name.querySelector("input");

    amount.textContent = amountInput.value;
    Name.textContent = NameInput.value;

    if (SaveIndex.children.length == 3) {
      SaveIndex.children[0].remove();
    }

    amount.setAttribute("data-editing", "false");
  }
}


// save edit
function saveEditData(i) {
  let amount = document.querySelector(`[i="${i}"][a="AmountUser"]`).children[0]
    .value;
  let Name = document.querySelector(`[i="${i}"][n="NameUser"]`).children[0]
    .value;
  dataStorge(Name, amount, i);
  showdata();
}
