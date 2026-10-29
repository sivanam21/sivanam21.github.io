// מערך לשמירת היסטוריית השיחה
let conversationHistory = [];

// ניהול חלונית אודות

// שמירת הקישור הפעיל המקורי לפני פתיחת חלונית אודות
let originalActiveLink = null;

/**
 * פונקציה לפתיחת חלונית אודות
 * מעדכנת את מצב התפריט ומציגה את החלונית
 */
window.showAboutPopup = function() {
    const popup = document.getElementById('aboutPopup');
    if (popup) {
        // שמירת הקישור הפעיל הנוכחי
        const currentActiveLink = document.querySelector('.nav-link.active');
        if (currentActiveLink && !currentActiveLink.classList.contains('about-btn')) {
            originalActiveLink = currentActiveLink;
            currentActiveLink.classList.remove('active');
        }
        
        // סימון כפתור אודות כקישור הפעיל בתפריט
        const aboutLink = document.querySelector('.about-btn');
        if (aboutLink) {
            aboutLink.classList.add('active');
        }
        
        // הצגת החלונית
        popup.style.display = 'flex';
        popup.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
};

/**
 * פונקציה לסגירת חלונית אודות
 * משחזרת את מצב התפריט המקורי
 */
window.hideAboutPopup = function() {
    const popup = document.getElementById('aboutPopup');
    if (popup) {
        popup.classList.remove('show');
        popup.style.display = 'none';
        document.body.style.overflow = '';
        
        // החזרת מצב הכפתור הפעיל בתפריט לקדמותו
        const aboutLink = document.querySelector('.about-btn');
        if (aboutLink) {
            aboutLink.classList.remove('active');
        }
        
        // שחזור הקישור הפעיל המקורי
        if (originalActiveLink) {
            originalActiveLink.classList.add('active');
            originalActiveLink = null;
        }
    }
};

// ניהול חלונית צור קשר

/**
 * פונקציה לפתיחת חלונית צור קשר
 */
window.showContactPopup = function() {
    const popup = document.getElementById('contactPopup');
    if (popup) {
        popup.style.display = 'flex';
        popup.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
};

/**
 * פונקציה לסגירת חלונית צור קשר
 */
window.hideContactPopup = function() {
    const popup = document.getElementById('contactPopup');
    if (popup) {
        popup.classList.remove('show');
        popup.style.display = 'none';
        document.body.style.overflow = '';
    }
};

// פונקציית שליחת אימייל

/**
 * פונקציה לפתיחת תוכנת דואר עם פרטים מוכנים מראש
 * מזהה את הדפדפן ומתאימה את הפעולה בהתאם
 */
window.openContactEmail = function() {
    // מניעת קריאות כפולות
    if (window.contactEmailOpening) {
        return;
    }
    window.contactEmailOpening = true;
    
    try {
        // הגדרת פרטי האימייל
        const recipients = 'sivanam21@gmail.com,neomimaor13@gmail.com,shaharsavirkarni@gmail.com';
        const subject = 'פנייה דרך האתר – צור קשר';
        
        // תבנית גוף האימייל
        const bodyTemplate = `היי,
אשמח ליצור קשר לגבי:
נושא: ________
שם: ________
טלפון: ________
הודעה: ________

נשלח דרך חלונית 'צור קשר' באתר.`;
        
        // בדיקה אם הדפדפן הוא כרום (לפי מאפייני המשתמש)
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        
        if (isChrome) {
            // עבור דפדפן כרום: פתיחת ממשק הדוא\"ל של גוגל
            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipients)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTemplate)}`;
            window.open(gmailComposeUrl, '_blank');
        } else {
            // עבור דפדפנים אחרים: שימוש בקישור דוא\"ל רגיל
            const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTemplate)}`;
            window.location.href = mailtoLink;
        }
        
        // איפוס הדגל לאחר עיכוב
        setTimeout(function() {
            window.contactEmailOpening = false;
        }, 2000);
        
        // סגירת החלונית לאחר פתיחת האימייל
        setTimeout(function() {
            window.hideContactPopup();
        }, 500);
        
    } catch (error) {
        console.error('Error opening email:', error);
        // גיבוי: הצגת כתובות האימייל בתוך חלונית צור קשר במקרה של שגיאה
        const emailList = 'sivanam21@gmail.com\nneomimaor13@gmail.com\nshaharsavirkarni@gmail.com';
        const message = `שגיאה בפתיחת תוכנת הדואר.\nאנא שלח אימייל ידנית לאחד מהכתובות הבאות:\n\n${emailList}\n\nנושא מומלץ: "פנייה דרך האתר – צור קשר"`;
        
        const contactPopup = document.getElementById('contactPopup');
        if (contactPopup) {
            const bodyEl = contactPopup.querySelector('.note-body');
            if (bodyEl) {
                bodyEl.innerText = message;
            }
            contactPopup.style.display = 'flex';
            contactPopup.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
};

// הפעלה ראשונית של הסקריפט כאשר הדף נטען
document.addEventListener("DOMContentLoaded", function () {
    // אתחול הצ'אט בתחילת העבודה
    initChat();
    
    // טיפול בפתיחה וסגירה של חלונית אודות
    
    // כפתור אודות בתפריט הניווט
    const aboutLink = document.querySelector('.about-btn');
    if (aboutLink) {
        aboutLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.showAboutPopup();
        });
    }
    
    // סגירת חלונית אודות בלחיצה על הרקע הכהה
    const aboutOverlays = document.querySelectorAll('#aboutPopup .about-overlay');
    aboutOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();
            window.hideAboutPopup();
        });
    });
    
    // טיפול בחלונית צור קשר
    
    // כפתור \"צור קשר\" בתחתית העמוד
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.showContactPopup();
        });
        
        // תמיכה במקלדת (אנטר / רווח לפתיחת החלונית)
        contactBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.showContactPopup();
            }
        });
    }
    
    // סגירת חלונית צור קשר בלחיצה על הרקע הכהה
    const contactOverlays = document.querySelectorAll('#contactPopup .about-overlay');
    contactOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();
            window.hideContactPopup();
        });
    });
    
    // כפתור שליחת אימייל מתוך חלונית צור קשר
    const emailButton = document.querySelector('#contactPopup .note-cta-btn');
    if (emailButton) {
        emailButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.openContactEmail();
        });
    }
    
    // כפתורי סגירה לחלוניות (ללא קוד נוסף בתוך קובצי התצוגה)
    const aboutCloseBtn = document.querySelector('#aboutPopup .close-popup-btn');
    if (aboutCloseBtn) {
        aboutCloseBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.hideAboutPopup();
        });
    }

    const contactCloseBtn = document.querySelector('#contactPopup .close-popup-btn');
    if (contactCloseBtn) {
        contactCloseBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.hideContactPopup();
        });
    }

    // סגירה אוטומטית של התפריט הנפתח בנייד לאחר בחירת קישור
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    const existingInstance = bootstrap.Collapse.getInstance(navbarCollapse);
                    const bsCollapse = existingInstance || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                }
            });
        });
    }

    // טיפול בשדות ההקלדה והכפתור של הצ'אט (ללא הגדרת אירועי לחיצה ישירות בקובצי התצוגה)
    const sendButton = document.querySelector('.card-footer .btn.btn-primary');
    const userInput = document.getElementById('userMessage');
    if (sendButton) {
        sendButton.addEventListener('click', function (e) {
            e.preventDefault();
            sendMessage();
        });
    }
    if (userInput) {
        userInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // סגירת חלוניות בלחיצה על מקש הבריחה במקלדת
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            window.hideAboutPopup();
            window.hideContactPopup();
        }
    });
});

// פונקציה ראשית לאתחול
async function initChat() {
    await fetchAndDisplayQuestion(true);
}

// פונקציה שמביאה שאלה מהשרת (משמשת גם להתחלה וגם ל"המשך תרגול")
async function fetchAndDisplayQuestion(isFirstTime) {
    const apiEndpoint = "/api/GPT/GetFirstQuestion";
    let targetArea;

    // אם זו פעם ראשונה, נציג בבועה העליונה. אם לא, נוסיף לצ'אט למטה.
    if (isFirstTime) {
        targetArea = document.getElementById("openingQuestionArea");
        targetArea.innerHTML = `
            <div class="typing-indicator">
                <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
            </div> <em>טוען שאלה לתרגול...</em>`;
    } else {
        // ב"המשך תרגול" נציג אינדיקטור טעינה רגיל בצ'אט
        showLoadingIndicator("temp-loading");
    }

    try {
        const response = await fetch(apiEndpoint);

        // הסרת אינדיקטור טעינה אם זה לא פעם ראשונה
        if (!isFirstTime) removeLoadingIndicator("temp-loading");

        if (response.ok) {
            const data = await response.json();

            if (isFirstTime) {
                targetArea.innerHTML = ""; // ניקוי אזור הפתיחה

                // 1. הוספת טקסט השאלה (קודם)
                const textDiv = document.createElement("div");
                textDiv.innerHTML = data.content;
                targetArea.appendChild(textDiv);
                
                // 2. הוספת תמונה (אם יש) - מתחת לשאלה
                if (data.imageUrl) {
                    const img = document.createElement("img");
                    img.src = data.imageUrl;
                    img.className = "img-fluid rounded mb-3 shadow-sm bot-generated-image";
                    targetArea.appendChild(img);
                }
            } else {
                // הוספת השאלה החדשה כהודעת בוט רגילה בצ'אט (כולל תמונה)
                appendMessageWithImage(data.content, data.imageUrl);
            }

            // שמירה בהיסטוריה
            conversationHistory.push({ role: "assistant", content: data.content });

        } else {
            console.error("Server Error:", await response.text());
            if(isFirstTime) targetArea.innerText = "שגיאה בטעינה.";
        }
    } catch (error) {
        console.error("Network error:", error);
        if (!isFirstTime) removeLoadingIndicator("temp-loading");
    }
}

// פונקציה לשליחת הודעה ע"י המשתמש
async function sendMessage() {
    const inputField = document.getElementById("userMessage");
    const userText = inputField.value.trim();

    if (!userText) return;

    // הסרת כפתורים ישנים אם נשארו פעילים
    removeOldButtons();

    // הצגת הודעת המשתמש
    appendMessage(userText, "user");
    inputField.value = "";
    conversationHistory.push({ role: "user", content: userText });

    // הצגת אינדיקטור טעינה
    const loadingId = showLoadingIndicator();

    try {
        const response = await fetch("/api/GPT/Chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(conversationHistory)
        });

        removeLoadingIndicator(loadingId);

        if (response.ok) {
            const botReply = await response.text();
            conversationHistory.push({ role: "assistant", content: botReply });

            // שימוש בפונקציה החדשה שמציגה את התשובה + הכפתורים בתוך הבועה
            appendMessageWithButtons(botReply);

        } else {
            appendMessage("שגיאה בקבלת תשובה.", "bot");
        }
    } catch (error) {
        removeLoadingIndicator(loadingId);
        appendMessage("שגיאה בתקשורת.", "bot");
    }
}

// פונקציה רגילה להוספת הודעה (משתמש או הודעות מערכת פשוטות)
function appendMessage(text, sender) {
    const chatWindow = document.getElementById("chatWindow");
    
    if (sender === "bot") {
        // יצירת מיכל עם תמונת פרופיל לבוט
        const wrapper = document.createElement("div");
        wrapper.classList.add("message-wrapper", "bot-wrapper");
        
        // תמונת פרופיל
        const avatar = document.createElement("img");
        avatar.src = "css/Images/Robot.png";
        avatar.classList.add("bot-avatar");
        avatar.alt = "Bot";
        
        // בועת הודעה
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "bot-message", "shadow-sm");
        messageDiv.innerText = text;
        
        wrapper.appendChild(avatar);
        wrapper.appendChild(messageDiv);
        chatWindow.appendChild(wrapper);
    } else {
        // הודעת משתמש ללא תמונת פרופיל
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "user-message", "shadow-sm");
        messageDiv.innerText = text;
        chatWindow.appendChild(messageDiv);
    }
    
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// === פונקציה : הודעת בוט עם כפתורים בתוכה ===
function appendMessageWithButtons(text) {
    const chatWindow = document.getElementById("chatWindow");
    
    // יצירת מיכל עם תמונת פרופיל לבוט
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "bot-wrapper");
    
    // תמונת פרופיל
    const avatar = document.createElement("img");
    avatar.src = "css/Images/Robot.png";
    avatar.classList.add("bot-avatar");
    avatar.alt = "Bot";
    
    // בועת הודעה
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "bot-message", "shadow-sm");

    // 1. הוספת הטקסט
    const textSpan = document.createElement("div");
    textSpan.innerText = text;
    messageDiv.appendChild(textSpan);

    // 2. יצירת אזור הכפתורים בתוך הבועה
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "action-buttons-container fade-in bot-buttons-container";
    buttonsDiv.id = "activeButtons";

    // כפתור המשך תרגול
    const continueBtn = document.createElement("button");
    continueBtn.className = "btn-action";
    continueBtn.innerText = "המשך תרגול";
    continueBtn.onclick = function() {
        removeOldButtons(); // הסרת הכפתורים כדי שלא ילחצו שוב
        fetchAndDisplayQuestion(false); // הבאת שאלה חדשה
    };

    // כפתור סיום שיחה
    const finishBtn = document.createElement("button");
    finishBtn.className = "btn-action btn-finish";
    finishBtn.innerText = "סיום שיחה";
    finishBtn.onclick = function() {
        removeOldButtons();
        endSession();
    };

    buttonsDiv.appendChild(finishBtn);
    buttonsDiv.appendChild(continueBtn);

    // הוספת הכפתורים לתוך הבועה
    messageDiv.appendChild(buttonsDiv);
    
    // הוספת תמונת פרופיל ובועת הודעה למיכל
    wrapper.appendChild(avatar);
    wrapper.appendChild(messageDiv);

    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// פונקציה להסרת כפתורים ישנים
function removeOldButtons() {
    const existingButtons = document.getElementById("activeButtons");
    if (existingButtons) {
        existingButtons.remove();
    }
}

// פונקציה לסיום השיחה
function endSession() {
    const endMsg = "השיחה נסגרה 🙂\nאפשר לחזור לתרגול בכל שלב.";
    appendMessage(endMsg, "bot");

    // נטרול שורת ההקלדה
    document.querySelector(".card-footer").classList.add("input-disabled");
    document.getElementById("userMessage").disabled = true;
}

// פונקציה להצגת הודעה עם תמונה (לשאלות ההמשך)
function appendMessageWithImage(text, imageUrl) {
    const chatWindow = document.getElementById("chatWindow");
    
    // יצירת מיכל עם תמונת פרופיל לבוט
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "bot-wrapper");
    
    // תמונת פרופיל
    const avatar = document.createElement("img");
    avatar.src = "css/Images/Robot.png";
    avatar.classList.add("bot-avatar");
    avatar.alt = "Bot";
    
    // בועת הודעה
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "bot-message", "shadow-sm");

    // הטקסט קודם, התמונה מתחת
    let htmlContent = `<div>${text}</div>`;
    if (imageUrl) {
        htmlContent += `<img src="${imageUrl}" class="img-fluid rounded mb-2 bot-generated-image">`;
    }

    messageDiv.innerHTML = htmlContent;
    
    // הוספת תמונת פרופיל ובועת הודעה למיכל
    wrapper.appendChild(avatar);
    wrapper.appendChild(messageDiv);

    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// פונקציות לאינדיקטור טעינה (3 נקודות)
function showLoadingIndicator(customId) {
    const chatWindow = document.getElementById("chatWindow");
    
    // יצירת מיכל עם תמונת פרופיל לבוט
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "bot-wrapper");
    const id = customId || "loading-" + Date.now();
    wrapper.id = id;
    
    // תמונת פרופיל
    const avatar = document.createElement("img");
    avatar.src = "css/Images/Robot.png";
    avatar.classList.add("bot-avatar");
    avatar.alt = "Bot";
    
    // בועת הודעה עם אינדיקטור טעינה
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "bot-message", "shadow-sm");

    loadingDiv.innerHTML = `
        <div class="typing-indicator">
            <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>`;
    
    // הוספת תמונת פרופיל ובועת הודעה למיכל
    wrapper.appendChild(avatar);
    wrapper.appendChild(loadingDiv);

    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return id;
}

function removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

