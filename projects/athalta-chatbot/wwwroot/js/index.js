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
        
        // החזרת הקישור שסומן קודם למצבו הרגיל
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
        const message = `שגיאה בפתיחת תוכנת הדואר.\nאנא שלח אימייל ידנית לאחד מהכתובות הבאות:\n\n${emailList}\n\nנושא מומלץ: \"פנייה דרך האתר – צור קשר\"`;
        
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

// מאזיני אירועים עבור דף הבית


// הפעלת הקוד רק לאחר טעינת כל רכיבי העמוד
document.addEventListener('DOMContentLoaded', function() {
    
    // טיפול בפתיחה וסגירה של חלונית אודות
    
    
    // כפתור אודות בתפריט הניווט
    const aboutLink = document.querySelector('.about-btn');
    if (aboutLink) {
        aboutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.showAboutPopup) {
                window.showAboutPopup();
            }
        });
    }
    
    // סגירת חלונית אודות בלחיצה על הרקע הכהה
    const aboutOverlays = document.querySelectorAll('#aboutPopup .about-overlay');
    aboutOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();
            if (window.hideAboutPopup) {
                window.hideAboutPopup();
            }
        });
    });
    
    // ============================================
    // טיפול בפתיחה וסגירה של חלונית צור קשר
    // ============================================
    
    // כפתור \"צור קשר\" בפוטר
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.showContactPopup) {
                window.showContactPopup();
            }
        });
        
        // תמיכה במקלדת (אנטר / רווח לפתיחת החלונית)
        contactBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (window.showContactPopup) {
                    window.showContactPopup();
                }
            }
        });
    }
    
    // סגירת חלונית צור קשר בלחיצה על הרקע הכהה
    const contactOverlays = document.querySelectorAll('#contactPopup .about-overlay');
    contactOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();
            if (window.hideContactPopup) {
                window.hideContactPopup();
            }
        });
    });
    
    // כפתור שליחת אימייל מתוך חלונית צור קשר
    const emailButton = document.querySelector('#contactPopup .note-cta-btn');
    if (emailButton) {
        emailButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.openContactEmail) {
                window.openContactEmail();
            }
        });
    }
    
    // כפתורי סגירה לחלוניות (ללא קוד נוסף בתוך קובצי התצוגה)
    const aboutCloseBtn = document.querySelector('#aboutPopup .close-popup-btn');
    if (aboutCloseBtn) {
        aboutCloseBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (window.hideAboutPopup) {
                window.hideAboutPopup();
            }
        });
    }

    const contactCloseBtn = document.querySelector('#contactPopup .close-popup-btn');
    if (contactCloseBtn) {
        contactCloseBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (window.hideContactPopup) {
                window.hideContactPopup();
            }
        });
    }
    
    // סגירה אוטומטית של תפריט נייד לאחר בחירת קישור
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
    
    // סגירת חלוניות בלחיצה על מקש הבריחה במקלדת
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            if (window.hideAboutPopup) {
                window.hideAboutPopup();
            }
            if (window.hideContactPopup) {
                window.hideContactPopup();
            }
        }
    });
});
