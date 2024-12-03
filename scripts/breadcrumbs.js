// automatically set the breadcrumbs for each page
if (document.readyState !== "loading") { 
    initBC();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    initBC();
  });
}

async function initBC() {
  await new Promise((resolve) => { // wait for nav first
    if (document.querySelector("nav") != null) {resolve()} 
    else {setTimeout(resolve, 10)}
  });
  const path = window.location.pathname;
  const pathArray = path.split("/");
  const div = document.createElement("div");
  div.id = "bc-container";
  const title = document.createElement("span");
  title.id = "bc-title";
  title.innerHTML = "You are here:";
  div.appendChild(title);
  const el = document.createElement("ul");
  el.id = "breadcrumbs";
  let breadcrumbPath = "";
  for (let i = 0; i < pathArray.length; i++) {
      if (pathArray[i] === "") {
          continue;
      }
      breadcrumbPath += "/" + pathArray[i];
      let li = document.createElement("li");
      li.classList.add("crumb");
      let a = document.createElement("a");
      a.href = breadcrumbPath;
      a.innerHTML = pathArray[i] + "⏎";
      li.appendChild(a);
      el.appendChild(li);
  }
  let nav = document.querySelector("nav");
  div.appendChild(el);
  nav.insertAdjacentElement("afterend", div);
  console.log('fired');
}