document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initScrollAnimations();
  initStickyNav();
  initMobileMenu();
  initSmoothScroll();
  initDarkMode();
  initScrollToTop();
  initAIAssistant();
});

/* --- Scroll Animations (Fade In Up) --- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(".fade-in-up");
  animatedElements.forEach((el) => observer.observe(el));
}

/* --- Sticky Navigation --- */
function initStickyNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("navbar-scrolled");
      nav.classList.remove("py-4", "bg-transparent");
    } else {
      nav.classList.remove("navbar-scrolled");
      nav.classList.add("py-4", "bg-transparent");
    }
  });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");
  const openIcon = btn?.querySelector(".menu-open-icon");
  const closeIcon = btn?.querySelector(".menu-close-icon");

  function toggleMenu() {
    const isOpen = !menu.classList.contains("closed");

    if (isOpen) {
      menu.classList.add("closed");
      menu.classList.remove("open");
      overlay?.classList.add("hidden");
      document.body.style.overflow = "";
      openIcon?.classList.remove("hidden");
      closeIcon?.classList.add("hidden");
    } else {
      menu.classList.remove("closed");
      menu.classList.add("open");
      overlay?.classList.remove("hidden");
      document.body.style.overflow = "hidden"; // Prevent background scroll
      openIcon?.classList.add("hidden");
      closeIcon?.classList.remove("hidden");
    }
  }

  btn?.addEventListener("click", toggleMenu);
  overlay?.addEventListener("click", toggleMenu);

  // Close menu when clicking a link
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });
}

/* --- Smooth Scrolling --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/* --- Dark Mode Toggle --- */
function initDarkMode() {
  const toggleBtn = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Check preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    html.classList.add("dark");
    html.setAttribute("data-theme", "dark");
  } else {
    html.classList.remove("dark");
    html.setAttribute("data-theme", "light");
  }

  toggleBtn?.addEventListener("click", () => {
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

/* --- Scroll To Top --- */
function initScrollToTop() {
  const btn = document.getElementById("scroll-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.remove("opacity-0", "invisible");
      btn.classList.add("opacity-100", "visible");
    } else {
      btn.classList.add("opacity-0", "invisible");
      btn.classList.remove("opacity-100", "visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --- AI Assistant --- */
function initAIAssistant() {
  const btn = document.getElementById("ai-assistant-btn");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("close-chat");
  const messagesContainer = document.getElementById("chat-messages");
  const optionBtns = document.querySelectorAll(".chat-option-btn");

  if (!btn || !panel) return;

  function toggleChat() {
    panel.classList.toggle("open");
  }

  btn.addEventListener("click", toggleChat);
  closeBtn?.addEventListener("click", toggleChat);

  // Handle Options
  optionBtns.forEach((optBtn) => {
    optBtn.addEventListener("click", (e) => {
      const question = e.target.innerText;
      const type = e.target.dataset.question;

      // Add User Message
      addMessage(question, "user");

      // Simulate Typing
      showTypingIndicator();

      // AI Response
      setTimeout(() => {
        removeTypingIndicator();
        const response = getAIResponse(type);
        addMessage(response.text, "ai");

        if (response.link) {
          setTimeout(() => {
            addLinkButton(response.linkText, response.link);
          }, 500);
        }
      }, 1500);
    });
  });

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("chat-message", sender);
    div.innerText = text;
    messagesContainer.appendChild(div);
    scrollToBottom();
  }

  function addLinkButton(text, url) {
    const btn = document.createElement("a");
    btn.href = url;
    btn.classList.add(
      "inline-block",
      "mt-2",
      "px-4",
      "py-2",
      "bg-secondary",
      "text-white",
      "rounded-full",
      "text-sm",
      "hover:bg-primary",
      "transition-colors",
    );
    btn.innerText = text;
    messagesContainer.appendChild(btn);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const div = document.createElement("div");
    div.classList.add("chat-message", "ai", "typing-indicator-container");
    div.id = "typing-indicator";
    div.innerHTML =
      '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(div);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function getAIResponse(type) {
    const responses = {
      "best-safari": {
        text: "For a first-time visitor, I highly recommend the Maasai Mara Safari. It offers the best chance to see the Big 5 and the Great Migration (seasonal).",
        link: "tour-details.html",
        linkText: "View Maasai Mara Safari",
      },
      budget: {
        text: "We have some great value options! Our Amboseli Adventure is a fantastic 2-day trip that is very affordable.",
        link: "tours.html",
        linkText: "View Budget Tours",
      },
      luxury: {
        text: "For the ultimate luxury, our 7-Day Best of Kenya includes exclusive lodges and flying safaris.",
        link: "tours.html",
        linkText: "View Luxury Options",
      },
      family: {
        text: "Our Tsavo Wilderness tour is great for families with comfortable pacing and engaging guides for kids.",
        link: "tour-details.html",
        linkText: "View Family Tours",
      },
      booking: {
        text: "Booking is easy! Just visit our Booking page, select your tour and dates, and we'll handle the rest.",
        link: "booking.html",
        linkText: "Go to Booking Page",
      },
    };

    return (
      responses[type] || {
        text: "I'm happy to help you explore our safaris! Check out our tours page.",
        link: "tours.html",
        linkText: "View All Tours",
      }
    );
  }
}
