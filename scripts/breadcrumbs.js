// automatically set the breadcrumbs for each page
if (document.readyState !== "loading") { 
  initBC();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    initBC();
  });
}

function initBC() {
  const path = window.location.pathname;
  const pathArray = path.split("/");
  const div = document.createElement("div");
  div.classList.add("bc-container");
  const el = document.createElement("ul");
  el.classList.add("breadcrumbs");
  let breadcrumbPath = "";
  for (let i = 0; i < pathArray.length; i++) {
      if (pathArray[i] === "") {
          continue;
      }
      breadcrumbPath += "/" + pathArray[i];
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.href = breadcrumbPath;
      a.innerHTML = pathArray[i];
      li.appendChild(a);
      el.appendChild(li);
  }
  let header = document.getElementById("header");
  div.appendChild(el);
  header.insertAdjacentElement("afterend", div);
  console.log('fired');
}