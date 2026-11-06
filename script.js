const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const certificateDialog = document.querySelector(".certificate-dialog");
const certificateDialogTitle = document.querySelector(".dialog-title");
const certificateDialogImage = document.querySelector(".dialog-image");
const contactForm = document.querySelector("#contact-form");
const aboutTabs = [...document.querySelectorAll(".about-tab")];
const certificateCards = [...document.querySelectorAll(".certificate-card")];
const seeMoreCertificates = document.querySelector("#see-more-certificates");

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  navigation.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-30% 0px -58% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

function activateAboutTab(tab) {
  aboutTabs.forEach((currentTab) => {
    const isActive = currentTab === tab;
    currentTab.classList.toggle("active", isActive);
    currentTab.setAttribute("aria-selected", String(isActive));
    currentTab.tabIndex = isActive ? 0 : -1;
    document.querySelector(`#${currentTab.getAttribute("aria-controls")}`).hidden = !isActive;
  });
}

aboutTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateAboutTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? aboutTabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : aboutTabs.length - 1)) % aboutTabs.length;
    aboutTabs[nextIndex].focus();
    activateAboutTab(aboutTabs[nextIndex]);
  });
});

seeMoreCertificates.addEventListener("click", () => {
  const isExpanded = seeMoreCertificates.getAttribute("aria-expanded") === "true";
  certificateCards.slice(3).forEach((card) => {
    card.hidden = isExpanded;
    if (!isExpanded) card.classList.add("is-visible");
  });
  seeMoreCertificates.setAttribute("aria-expanded", String(!isExpanded));
  seeMoreCertificates.textContent = isExpanded ? "See more" : "See less";
});

document.querySelectorAll("[data-certificate]").forEach((button) => {
  button.addEventListener("click", () => {
    const imagePath = decodeURIComponent(button.dataset.certificate);
    const thumbnail = button.querySelector("img");
    certificateDialogTitle.textContent = button.dataset.title;
    certificateDialogImage.src = imagePath;
    certificateDialogImage.alt = thumbnail.alt;

    if (typeof certificateDialog.showModal === "function") {
      certificateDialog.showModal();
    } else {
      certificateDialog.setAttribute("open", "");
    }
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => {
  certificateDialog.close();
});

certificateDialog.addEventListener("click", (event) => {
  if (event.target === certificateDialog) certificateDialog.close();
});

certificateDialog.addEventListener("close", () => {
  certificateDialogImage.removeAttribute("src");
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const subject = `Portfolio message from ${formData.get("name")}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    "",
    formData.get("message"),
  ].join("\n");
  const mailto = `mailto:vikramkv993@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
