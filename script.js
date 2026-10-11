const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const formSubmit = contactForm.querySelector(".form-submit");
const floatingActions = document.querySelector(".floating-actions");
const siteFooter = document.querySelector(".site-footer");
const portraitCard = document.querySelector(".portrait-card");
const landscapeMobileQuery = window.matchMedia(
  "(orientation: landscape) and (max-height: 500px) and (max-width: 950px)",
);

portraitCard.addEventListener("click", () => {
  if (landscapeMobileQuery.matches) {
    portraitCard.classList.toggle("is-straight");
  }
});

window.addEventListener("resize", () => {
  if (!landscapeMobileQuery.matches) {
    portraitCard.classList.remove("is-straight");
  }
});

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    isExpanded ? "Open navigation menu" : "Close navigation menu",
  );
  navLinks.classList.toggle("is-open", !isExpanded);
  document.body.classList.toggle("menu-open", !isExpanded);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.querySelectorAll('.contact-social-links a[aria-disabled="true"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

function positionFloatingActionsAboveFooter() {
  if (!window.matchMedia("(max-width: 700px)").matches) {
    floatingActions.style.removeProperty("bottom");
    floatingActions.style.removeProperty("visibility");
    return;
  }

  const footerRect = siteFooter.getBoundingClientRect();
  if (footerRect.top >= window.innerHeight || footerRect.bottom <= 0) {
    floatingActions.style.removeProperty("bottom");
    floatingActions.style.removeProperty("visibility");
    return;
  }

  const bottomOffset = window.innerHeight - footerRect.top + 12;
  const actionsTop = window.innerHeight - bottomOffset - floatingActions.offsetHeight;
  const headerBottom = document.querySelector(".site-header").getBoundingClientRect().bottom;

  floatingActions.style.bottom = `${bottomOffset}px`;
  floatingActions.style.visibility = actionsTop < headerBottom + 8 ? "hidden" : "visible";
}

window.addEventListener("scroll", positionFloatingActionsAboveFooter, { passive: true });
window.addEventListener("resize", positionFloatingActionsAboveFooter);
positionFloatingActionsAboveFooter();

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formNote.textContent = "Sending your message...";
  formSubmit.disabled = true;

  try {
    const response = await fetch(
      contactForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/"),
      {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      },
    );
    const result = await response.json();

    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error(result.message || "The message could not be sent.");
    }

    formNote.textContent = "Message sent successfully!";
    contactForm.reset();
  } catch (error) {
    formNote.textContent =
      error instanceof Error
        ? `${error.message} Please try again or email devkhadem@gmail.com directly.`
        : "The message could not be sent. Please try again or email devkhadem@gmail.com directly.";
  } finally {
    formSubmit.disabled = false;
  }
});
