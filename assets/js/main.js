const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const contactForm = document.querySelector("[data-contact-form]");
const projectModal = document.querySelector("[data-project-modal]");
const modalPanel = projectModal?.querySelector(".project-modal-panel");
const modalImage = projectModal?.querySelector("[data-modal-image]");
const modalTitle = projectModal?.querySelector("[data-modal-title]");
const modalDescription = projectModal?.querySelector("[data-modal-description]");
const cookieBanner = document.querySelector("#cookieBanner");
const cookieAccept = document.querySelector("[data-cookie-accept]");
const cookieClose = document.querySelector("[data-cookie-close]");
const termsModal = document.querySelector("#termsModal");
const termsOpen = document.querySelectorAll("[data-terms-open]");
const termsClose = document.querySelectorAll("[data-terms-close]");
const videoPopup = document.querySelector("[data-video-popup]");
const videoPopupPanel = videoPopup?.querySelector(".video-popup-panel");
const videoFrame = videoPopup?.querySelector("[data-video-frame]");
const cookieStorageKey = "calutec_cookie_terms_v1";
let activeProjectTrigger = null;

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const nome = data.get("nome")?.toString().trim();
  const telefone = data.get("telefone")?.toString().trim();
  const servico = data.get("servico")?.toString().trim();
  const mensagem = data.get("mensagem")?.toString().trim();

  const text = [
    "Olá, quero solicitar um orçamento com a Calutec.",
    "",
    `Nome: ${nome}`,
    `Telefone: ${telefone}`,
    `Tipo de projeto: ${servico}`,
    `Mensagem: ${mensagem}`,
  ].join("\n");

  window.open(`https://wa.me/5541996310725?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

const closeProjectModal = () => {
  if (!projectModal) return;

  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (modalImage) {
    modalImage.removeAttribute("src");
    modalImage.alt = "";
  }

  activeProjectTrigger?.focus();
  activeProjectTrigger = null;
};

const openProjectModal = (trigger) => {
  const card = trigger.closest(".project-card");
  if (!projectModal || !card || !modalImage || !modalTitle || !modalDescription) return;

  const { projectTitle, projectImage, projectDescription } = card.dataset;
  if (!projectTitle || !projectImage || !projectDescription) return;

  activeProjectTrigger = trigger;
  modalImage.src = projectImage;
  modalImage.alt = `Prévia de ${projectTitle}`;
  modalTitle.textContent = projectTitle;
  modalDescription.textContent = projectDescription;
  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalPanel?.focus();
};

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-project-trigger]");
  if (trigger) {
    openProjectModal(trigger);
    return;
  }

  if (event.target.closest("[data-modal-close]")) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("is-open")) {
    closeProjectModal();
  }
});

if (cookieBanner && cookieAccept && cookieClose) {
  const hasCookieDecision = localStorage.getItem(cookieStorageKey);

  if (!hasCookieDecision) {
    cookieBanner.hidden = false;
  }

  cookieAccept.addEventListener("click", () => {
    localStorage.setItem(cookieStorageKey, "accepted");
    cookieBanner.hidden = true;
  });

  cookieClose.addEventListener("click", () => {
    localStorage.setItem(cookieStorageKey, "closed");
    cookieBanner.hidden = true;
  });
}

if (termsModal && termsOpen.length && termsClose.length) {
  const openTerms = (event) => {
    event.preventDefault();
    termsModal.hidden = false;
    document.body.classList.add("modal-open");
    termsModal.querySelector("[data-terms-close]")?.focus();
  };

  const closeTerms = () => {
    termsModal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  termsOpen.forEach((trigger) => {
    trigger.addEventListener("click", openTerms);
  });

  termsClose.forEach((trigger) => {
    trigger.addEventListener("click", closeTerms);
  });

  termsModal.addEventListener("click", (event) => {
    if (event.target === termsModal) {
      closeTerms();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !termsModal.hidden) {
      closeTerms();
    }
  });
}

const closeVideoPopup = () => {
  if (!videoPopup) return;

  videoPopup.hidden = true;
  videoPopup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (videoFrame) {
    videoFrame.removeAttribute("src");
  }
};

const openVideoPopup = () => {
  if (!videoPopup || !videoFrame) return;

  videoFrame.src = videoFrame.dataset.videoSrc || "";
  videoPopup.hidden = false;
  videoPopup.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  videoPopupPanel?.focus();
};

if (videoPopup) {
  window.addEventListener("load", () => {
    window.setTimeout(openVideoPopup, 650);
  }, { once: true });

  videoPopup.addEventListener("click", (event) => {
    if (event.target.closest("[data-video-popup-close]")) {
      closeVideoPopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !videoPopup.hidden) {
      closeVideoPopup();
    }
  });
}

const canvas = document.querySelector("#tech-canvas");
const context = canvas?.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && context && !prefersReducedMotion) {
  const pointer = { x: 0, y: 0, active: false };
  let particles = [];
  let animationFrame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(90, Math.max(42, Math.floor(rect.width / 18)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      size: Math.random() * 1.8 + 0.8,
    }));
  };

  const draw = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 130) {
          particle.x -= dx * 0.002;
          particle.y -= dy * 0.002;
        }
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 90, 0, 0.62)";
      context.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const next = particles[nextIndex];
        const distance = Math.hypot(particle.x - next.x, particle.y - next.y);

        if (distance < 118) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.strokeStyle = `rgba(255, 90, 0, ${0.2 - distance / 720})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    });

    animationFrame = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  }, { passive: true });

  resize();
  draw();

  window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
}
