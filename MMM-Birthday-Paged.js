/**
 * @file MMM-Birthday-Paged.js
 * @description A MagicMirror² module that displays birthday celebrations with fireworks and confetti
 * @author Christian Gillinger
 * @license MIT
 * @version 1.4.2
 * 
 * Fork Info: This is a fork of MMM-Birthday specifically optimized for installations
 * using page-switching modules like MMM-pages or MMM-Carousel
 */

Module.register("MMM-Birthday-Paged", {
    defaults: {
        birthdays: [],           
        fireworkDuration: "infinite",
        confettiDuration: "infinite",
        debug: false,             
        startupDelay: 2000      
    },

    getStyles: function() {
        return ["MMM-Birthday-Paged.css"];
    },

    getScripts: function() {
        return [
            this.file('fireworks.js'),
            this.file('confetti.js')
        ];
    },

    getTranslations: function() {
        return {
            en: "translations/en.json",
            sv: "translations/sv.json",
            da: "translations/da.json",
            de: "translations/de.json",
            es: "translations/es.json",
            fi: "translations/fi.json",
            fr: "translations/fr.json",
            it: "translations/it.json",
            nl: "translations/nl.json",
            no: "translations/no.json",
            pt: "translations/pt.json",
            uk: "translations/uk.json"
        };
    },

    log: function(message, type = 'info') {
        if (this.config.debug) {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = `[MMM-Birthday-Paged][${timestamp}]`;
            switch(type.toLowerCase()) {
                case 'error':
                    console.error(prefix, message);
                    break;
                case 'warn':
                    console.warn(prefix, message);
                    break;
                case 'debug':
                    console.debug(prefix, message);
                    break;
                default:
                    console.log(prefix, message);
            }
        }
    },

    start: function() {
        this.log("Starting module initialization");
        
        this.loaded = false;
        this.fireworks = null;
        this.celebrating = false;
        this._wasCelebrating = false;
        this.celebrationInterval = null;
        this.currentCelebrant = null;

        this.language = config.language || 'en';
        this.log(`Using language: ${this.language}`);
        
        this.defaultTranslations = {
            MESSAGES: [
                "🎉 Happy Birthday, {name}! 🎂",
                "🎈 Best wishes on your special day, {name}! 🎁",
                "🌟 Have a fantastic birthday, {name}! 🎊"
            ]
        };

        this.scheduleNextCheck();
        this.log("Module initialization completed");
    },

    cleanupCelebration: function() {
        this.log("Starting celebration cleanup");
        
        if (this.fireworks) {
            this.log("Cleaning up fireworks");
            this.fireworks.cleanup();
        }
        
        this.log("Cleaning up confetti");
        Confetti.cleanup();
        
        if (this.celebrationInterval) {
            this.log("Clearing celebration interval");
            clearInterval(this.celebrationInterval);
        }
        
        const wrapper = document.querySelector('.birthday-module');
        if (wrapper) {
            this.log("Removing celebration wrapper from DOM");
            wrapper.remove();
        }
        
        this.log("Resetting other modules' appearance");
        document.querySelectorAll('.module').forEach(module => {
            if (!module.classList.contains('birthday-module')) {
                module.style.filter = '';
            }
        });
        
        this.log("Celebration cleanup completed");
    },

    suspend: function() {
        this.log("Module suspend triggered");
        
        if (this.celebrating) {
            this.log(`Suspending active celebration for ${this.currentCelebrant}`);
            this._wasCelebrating = true;
            this.cleanupCelebration();
            this.celebrating = false;
            this.log("Celebration suspended successfully");
        } else {
            this.log("No active celebration to suspend");
        }
    },

    resume: function() {
        this.log("Module resume triggered");
        
        if (this._wasCelebrating) {
            this.log("Resuming previous celebration");
            
            this.cleanupCelebration();
            this._wasCelebrating = false;
            this.celebrating = true;
            
            const now = new Date();
            const currentDate = (now.getMonth() + 1).toString().padStart(2, '0') + 
                              "-" + now.getDate().toString().padStart(2, '0');
            
            this.log(`Checking if ${currentDate} matches any birthdays`);
            
            const birthdayPerson = this.config.birthdays.find(birthday => 
                birthday.date === currentDate
            );
            
            if (birthdayPerson) {
                this.log(`Birthday is still active for ${birthdayPerson.name}, restarting celebration`);
                this.currentCelebrant = birthdayPerson.name;
                setTimeout(() => {
                    this.celebrateBirthday(birthdayPerson.name);
                }, 500);
            } else {
                this.log("Birthday is no longer active, cleaning up", 'warn');
                this.celebrating = false;
                this._wasCelebrating = false;
                this.currentCelebrant = null;
                this.cleanupCelebration();
            }
        } else {
            this.log("No celebration to resume");
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "birthday-module";
        this.log("Created DOM wrapper");
        return wrapper;
    },

    scheduleNextCheck: function() {
        this.log("Scheduling birthday checks");
        
        setTimeout(() => {
            this.log("Performing initial birthday check after startup delay");
            this.checkBirthdays();
        }, this.config.startupDelay);

        setInterval(() => {
            this.checkBirthdays();
        }, 60000);
    },

    checkBirthdays: function() {
        const now = new Date();
        const currentDate = (now.getMonth() + 1).toString().padStart(2, '0') + 
                           "-" + now.getDate().toString().padStart(2, '0');

        this.log(`Checking birthdays for date: ${currentDate}`);

        if (!Array.isArray(this.config.birthdays)) {
            this.log("Birthdays configuration is not an array", 'error');
            return;
        }

        const birthdayPerson = this.config.birthdays.find(birthday => birthday.date === currentDate);
        
        if (birthdayPerson && !this.celebrating && !this._wasCelebrating) {
            this.log(`Found birthday for ${birthdayPerson.name} on ${currentDate}`);
            this.currentCelebrant = birthdayPerson.name;
            this.celebrating = true;
            this.celebrateBirthday(birthdayPerson.name);
        }
    },

    getRandomMessage: function(name) {
        let messages;
        try {
            messages = this.translate("MESSAGES");
            if (messages === "MESSAGES") {
                this.log("Using default messages (translation not found)");
                messages = this.defaultTranslations.MESSAGES;
            }
        } catch (e) {
            this.log("Translation failed, using default messages", 'warn');
            messages = this.defaultTranslations.MESSAGES;
        }
        
        if (!Array.isArray(messages)) {
            this.log("Invalid translation format, using default messages", 'warn');
            messages = this.defaultTranslations.MESSAGES;
        }

        const message = messages[Math.floor(Math.random() * messages.length)];
        return message.replace('{name}', name);
    },

    celebrateBirthday: function(name) {
        this.log(`Starting celebration for ${name}`);
        
        if (!this.fireworks) {
            this.fireworks = new Fireworks();
        }
        Confetti.init();

        const wrapper = document.querySelector('.birthday-module') || this.createWrapper();
        const messageDiv = document.createElement("div");
        messageDiv.className = "birthday-message";
        messageDiv.innerHTML = this.getRandomMessage(name);
        
        wrapper.innerHTML = '';
        wrapper.appendChild(messageDiv);
        wrapper.style.display = 'block';

        this.log("Celebration display created");

        this.dimOtherModules();
        this.startFireworks();
        this.startConfetti();

        if (this.config.fireworkDuration !== "infinite") {
            this.log(`Setting celebration duration: ${this.config.fireworkDuration}ms`);
            setTimeout(() => {
                this.stopCelebration(wrapper);
            }, this.config.fireworkDuration);
        }
    },

    startFireworks: function() {
        this.log("Starting fireworks animation");
        this.fireworks.start(this.config.fireworkDuration);
    },

    startConfetti: function() {
        this.log("Starting confetti animation");
        const isInfinite = this.config.confettiDuration === "infinite";
        const end = isInfinite ? Infinity : Date.now() + this.config.confettiDuration;

        const fireBurst = () => {
            if (this.celebrating && (isInfinite || Date.now() < end)) {
                Confetti.fire();
                const nextDelay = 2000 + Math.random() * 6000;
                setTimeout(fireBurst, nextDelay);
            }
        };

        setTimeout(fireBurst, 1000);
    },

    stopCelebration: function(wrapper) {
        this.log("Stopping celebration");
        if (this.celebrationInterval) {
            clearInterval(this.celebrationInterval);
        }
        
        wrapper.style.display = 'none';
        
        document.querySelectorAll('.module').forEach(module => {
            module.style.filter = '';
        });
        
        this.celebrating = false;
        this._wasCelebrating = false;
        this.currentCelebrant = null;
        
        if (this.fireworks) {
            this.fireworks.cleanup();
        }
        Confetti.cleanup();
        
        this.log("Celebration stopped successfully");
    },

    createWrapper: function() {
        this.log("Creating new celebration wrapper");
        const wrapper = document.createElement("div");
        wrapper.className = "birthday-module";
        document.body.appendChild(wrapper);
        return wrapper;
    },

    dimOtherModules: function() {
        this.log("Dimming other modules");
        document.querySelectorAll('.module').forEach(module => {
            if (!module.classList.contains('birthday-module')) {
                module.style.filter = 'brightness(30%)';
                module.style.transition = 'filter 0.5s ease-in-out';
            }
        });
    }
});
