/**
 * Personal Portfolio Application Javascript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileMenu();
  initTypingEffect();
  initScrollReveal();
  initLightbox();
  initContactForm();
});

/* ==========================================================================
   1. Theme Toggle & Memory
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  } else {
    const defaultTheme = systemPrefersDark ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', defaultTheme);
    localStorage.setItem('theme', defaultTheme);
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==========================================================================
   2. Header Scroll Effect
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Header shadow/blur on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Link Highlighting on Scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger once on load
}

/* ==========================================================================
   3. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');

    // Toggle hamburger icon animation
    if (navMenu.classList.contains('active')) {
      menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    }
  });

  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      menuToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    }
  });
}

/* ==========================================================================
   4. Typing typewriter effect
   ========================================================================== */
function initTypingEffect() {
  const words = ["南臺科大五專資工三甲的學生"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingText = document.getElementById('typing-text');

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = 100;

    if (isDeleting) {
      typeSpeed /= 2; // Delete faster
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  if (typingText) {
    setTimeout(type, 500);
  }
}

/* ==========================================================================
   5. IntersectionObserver for Reveal Animations & Skill Bars
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-el');
  const skillFills = document.querySelectorAll('.skill-progress-fill');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);

        // Trigger skill bars animation if we reveal the skills card container
        if (entry.target.classList.contains('skills-container')) {
          animateSkillBars();
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  function animateSkillBars() {
    skillFills.forEach(fill => {
      const targetPercent = fill.getAttribute('data-percent');
      fill.style.width = targetPercent;
    });
  }
}



/* ==========================================================================
   7. Portfolio Detail Lightbox Modal
   ========================================================================== */
const projectsDetails = {
  p1: {
    title: "智慧合約虛擬儀表板",
    badge: "Front-End",
    tags: [],
    desc: "一個極具科技感的區塊鏈資料視覺化平台，能即時監控智慧合約的交易流量、Gas 消耗與鏈上事件分析。",
    liveUrl: "https://example.com/project1",
    sourceUrl: "https://github.com/example/project1",
    icon: `<rect x="2" y="3" width="20" height="14" rx="2" stroke-linecap="round"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`
  },
  p2: {
    title: "分散式 API 閘道系統",
    badge: "Back-End",
    tags: [],
    desc: "基於 Node.js 叢集架構開發的高效能 API 閘道，支援動態路由轉發、IP 限流防護與 Redis 快取機制。",
    liveUrl: "https://example.com/project2",
    sourceUrl: "https://github.com/example/project2",
    icon: `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/>`
  },
  p3: {
    title: "智慧家居控制 App 設計",
    badge: "UI/UX Design",
    tags: [],
    desc: "以使用者為中心進行研究，設計極簡新擬態 (Neumorphism) 風格的智慧家居操作介面，提升日常操作流暢度。",
    liveUrl: "https://example.com/project3",
    sourceUrl: "https://github.com/example/project3",
    icon: `<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M7.5 10.5C8.32843 10.5 9 9.82843 9 9C9 8.17157 8.32843 7.5 7.5 7.5C6.67157 7.5 6 8.17157 6 9C6 9.82843 6.67157 10.5 7.5 10.5Z"/><path d="M11.5 7.5C12.3284 7.5 13 6.82843 13 6C13 5.17157 12.3284 4.5 11.5 4.5C10.6716 4.5 10 5.17157 10 6C10 6.82843 10.6716 7.5 11.5 7.5Z"/><path d="M16.5 10.5C17.3284 10.5 18 9.82843 18 9C18 8.17157 17.3284 7.5 16.5 7.5C15.6716 7.5 15 8.17157 15 9C15 9.82843 15.6716 10.5 16.5 10.5Z"/><path d="M6 14C6 16.2091 8.68629 18 12 18C15.3137 18 18 16.2091 18 14H6Z"/>`
  },
  p4: {
    title: "3D 線上展示互動商城",
    badge: "Front-End",
    tags: [],
    desc: "運用 Three.js 開發之網頁 3D 商品互動式展示，提供滑鼠拖曳旋轉、變更商品顏色及沉浸式 AR 預覽效果。",
    liveUrl: "https://example.com/project4",
    sourceUrl: "https://github.com/example/project4",
    icon: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`
  },
  p5: {
    title: "即時協同編輯後端架構",
    badge: "Back-End",
    tags: [],
    desc: "支援多用戶線上編輯同一份文件的 Socket.io 架構，結合 OT (Operational Transformation) 演算法解決衝突。",
    liveUrl: "https://example.com/project5",
    sourceUrl: "https://github.com/example/project5",
    icon: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`
  },
  p6: {
    title: "虛擬貨幣交易所 Web 端視覺",
    badge: "UI/UX Design",
    tags: [],
    desc: "重新定義加密貨幣交易平台的視覺指引，包含自訂下單介面、K線圖表主題色，提升 30% 交易流暢感。",
    liveUrl: "https://example.com/project6",
    sourceUrl: "https://github.com/example/project6",
    icon: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="16.5 19.79 16.5 14.6 21 12"/><polyline points="12 22.08 12 12 12 6.81"/>`
  }
};

function initLightbox() {
  const lightbox = document.getElementById('project-lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const cards = document.querySelectorAll('.portfolio-card');

  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc = document.getElementById('lightbox-desc');
  const lbTags = document.getElementById('lightbox-tags');
  const lbImgWrapper = document.getElementById('lightbox-img-wrapper');
  const lbLiveBtn = document.getElementById('btn-lightbox-live');
  const lbSourceBtn = document.getElementById('btn-lightbox-source');

  const openLightbox = (projectId) => {
    const data = projectsDetails[projectId];
    if (!data) return;

    // Populate details
    lbTitle.textContent = data.title;
    lbDesc.textContent = data.desc;
    lbLiveBtn.setAttribute('href', data.liveUrl);
    lbSourceBtn.setAttribute('href', data.sourceUrl);

    // Populate SVG Icon representation
    lbImgWrapper.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" style="width:25%; height:25%; opacity:0.8;">
        ${data.icon}
      </svg>
    `;

    // Populate tags
    lbTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.classList.add('portfolio-tag');
      span.textContent = tag;
      lbTags.appendChild(span);
    });

    // Display Modal
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent page scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scroll
  };

  // Attach listeners to cards
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      openLightbox(projectId);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  // Close when clicking outside card content
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ESC Key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   8. Contact Form Interaction & LocalStorage Log
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');

  const formSuccess = document.getElementById('form-success');
  const resetBtn = document.getElementById('btn-reset-form');

  const validateField = (input, errorElId, message) => {
    const errorEl = document.getElementById(errorElId);
    if (!input.value.trim()) {
      input.classList.add('error');
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      return false;
    } else {
      input.classList.remove('error');
      errorEl.style.display = 'none';
      return true;
    }
  };

  const validateEmail = () => {
    const errorEl = document.getElementById('error-email');
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!val) {
      emailInput.classList.add('error');
      errorEl.textContent = '請填寫電子郵件';
      errorEl.style.display = 'block';
      return false;
    } else if (!emailRegex.test(val)) {
      emailInput.classList.add('error');
      errorEl.textContent = '請輸入有效的電子郵件格式';
      errorEl.style.display = 'block';
      return false;
    } else {
      emailInput.classList.remove('error');
      errorEl.style.display = 'none';
      return true;
    }
  };

  // Input validations on typing
  nameInput.addEventListener('input', () => validateField(nameInput, 'error-name', '請填寫姓名'));
  emailInput.addEventListener('input', validateEmail);
  messageInput.addEventListener('input', () => validateField(messageInput, 'error-message-text', '請填寫訊息內容'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Execute all validations
    const isNameVal = validateField(nameInput, 'error-name', '請填寫姓名');
    const isEmailVal = validateEmail();
    const isMsgVal = validateField(messageInput, 'error-message-text', '請填寫訊息內容');

    if (isNameVal && isEmailVal && isMsgVal) {
      // Pack details
      const msgData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
      };

      // Store in LocalStorage logs for fallback/record keeping
      const currentMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      currentMessages.push(msgData);
      localStorage.setItem('contact_messages', JSON.stringify(currentMessages));

      // Animate submit button
      const submitBtn = document.getElementById('btn-submit-form');
      submitBtn.innerHTML = `送出中...`;
      submitBtn.disabled = true;

      // Actual email submission using FormSubmit AJAX Endpoint
      fetch('https://formsubmit.co/ajax/5b2g0025@stust.edu.tw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(msgData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === 'true' || data.success === true) {
          // Toggle view panels to show success message
          form.style.display = 'none';
          formSuccess.style.display = 'flex';
        } else {
          alert('發送失敗，請稍後再試。原因: ' + (data.message || '未知錯誤'));
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('發送時發生錯誤，請檢查網路連線後再試。');
      })
      .finally(() => {
        // Reset submit button state
        submitBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" style="transform: rotate(-15deg);"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          發送訊息
        `;
        submitBtn.disabled = false;
      });
    }
  });

  resetBtn.addEventListener('click', () => {
    // Clear inputs
    form.reset();

    // Remove styling states
    const inputs = [nameInput, emailInput, messageInput];
    inputs.forEach(inp => inp.classList.remove('error'));

    const errors = ['error-name', 'error-email', 'error-message-text'];
    errors.forEach(errId => document.getElementById(errId).style.display = 'none');

    // Toggle view back to form
    formSuccess.style.display = 'none';
    form.style.display = 'block';
  });
}
