const menuGrid = document.getElementById("menuGrid");

APP_CONFIG.services.forEach(service => {
  const link = document.createElement("a");
  link.className = "menu-card";

  const hasUrl =
    service.url &&
    !service.url.startsWith("PASTE_");

  if (hasUrl) {
    link.href = service.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#";
    link.classList.add("disabled");
    link.setAttribute("aria-disabled", "true");
  }

  link.innerHTML = `
    <div class="menu-icon">${service.icon}</div>
    <div class="menu-content">
      <h2 class="menu-title">${service.title}</h2>
      <p class="menu-description">${service.description}</p>
    </div>
  `;

  menuGrid.appendChild(link);
});
