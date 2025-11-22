document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitButton = form?.querySelector("button[type='submit']");
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = themeToggle?.querySelector(".label");
  const root = document.documentElement;

  if (!form) return;

  const setStatus = (message, ok = true) => {
    if (!status) return;
    status.textContent = message;
    status.style.color = ok ? "#74d0ff" : "#f3c86a";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      setStatus("Revisa los campos obligatorios.", false);
      return;
    }

    submitButton.disabled = true;
    setStatus("Enviando...");

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action || "contact.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setStatus(data.message || "Mensaje enviado. Te contactaremos pronto.");
        form.reset();
      } else {
        throw new Error(data.message || "No pudimos enviar el mensaje.");
      }
    } catch (error) {
      setStatus(error.message || "Error al enviar. Intenta nuevamente.", false);
    } finally {
      submitButton.disabled = false;
    }
  });

  // Theme toggle with preference storage.
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (themeLabel) {
      themeLabel.textContent = theme === "light" ? "Modo oscuro" : "Modo claro";
    }
  };
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    themeToggle.classList.add("toggling");
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
    setTimeout(() => themeToggle.classList.remove("toggling"), 300);
  });

  // Scroll-based reveal animations.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
});
