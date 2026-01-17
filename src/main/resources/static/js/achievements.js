// Achievement notification system for Bloosm
class AchievementNotifier {
    constructor() {
        this.notifications = [];
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        if (document.getElementById('achievementNotifications')) return;

        const container = document.createElement('div');
        container.id = 'achievementNotifications';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    showAchievementUnlocked(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 10px;
            box-shadow: 0 10px 30px rgba(255, 20, 147, 0.4);
            transform: translateX(400px);
            transition: all 0.5s ease;
            pointer-events: auto;
            cursor: pointer;
            max-width: 350px;
            backdrop-filter: blur(10px);
            border: 2px solid #FF1493;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 2.5em;">${achievement.badgeIcon || '🏆'}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 5px;">
                        🎉 Achievement Unlocked!
                    </div>
                    <div style="font-weight: bold; color: #FF1493;">${achievement.title}</div>
                    <div style="font-size: 0.9em; opacity: 0.9; margin-top: 3px;">
                        ${achievement.description}
                    </div>
                    <div style="font-size: 0.8em; margin-top: 8px; background: rgba(255, 20, 147, 0.3); padding: 3px 8px; border-radius: 10px; display: inline-block; color: #fff; font-weight: bold;">
                        +${achievement.pointsReward} points
                    </div>
                </div>
                <div style="font-size: 1.5em; opacity: 0.7;">✨</div>
            </div>
        `;

        // Add click handler
        notification.onclick = () => {
            window.location.href = 'achievements.html';
        };

        // Add tooltip
        notification.title = 'Click to view all achievements';

        const container = document.getElementById('achievementNotifications');
        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 8 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 8000);

        // Play achievement sound (optional)
        this.playAchievementSound();
    }

    playAchievementSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUdBCTH8O2pVhcBGW5Nd5RuOwZBmOr1s2AZ');
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Ignore audio play errors (browser restrictions)
            });
        } catch (e) {
            // Ignore audio errors
        }
    }

    // Check for new achievements after actions
    async checkAchievements(customerId) {
        if (!customerId) return;

        try {
            const response = await fetch(`/api/achievements/customer/${customerId}/unlocked`);
            const data = await response.json();
            
            if (data.success && data.unlockedAchievements) {
                // Check for newly unlocked achievements (you might want to store previously shown achievements)
                const recentAchievements = data.unlockedAchievements
                    .filter(ca => {
                        const unlockedDate = new Date(ca.unlockedDate);
                        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                        return unlockedDate > fiveMinutesAgo;
                    })
                    .slice(0, 3); // Limit to 3 most recent

                recentAchievements.forEach(ca => {
                    this.showAchievementUnlocked(ca.achievement);
                });
            }
        } catch (error) {
            console.error('Error checking achievements:', error);
        }
    }
}

// Global achievement notifier instance
const achievementNotifier = new AchievementNotifier();

// Achievement checking functions
async function checkAchievementsAfterOrder(customerId) {
    if (customerId) {
        setTimeout(() => {
            achievementNotifier.checkAchievements(customerId);
        }, 1000); // Delay to allow backend processing
    }
}

async function checkAchievementsAfterRegistration(customerId) {
    if (customerId) {
        setTimeout(() => {
            achievementNotifier.checkAchievements(customerId);
        }, 2000); // Delay for registration achievements
    }
}

// Achievement progress display utilities
function createAchievementBadge(achievement, isUnlocked = false) {
    const badge = document.createElement('div');
    badge.className = `achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`;
    badge.style.cssText = `
        display: inline-block;
        background: ${isUnlocked ? 'linear-gradient(135deg, #FF69B4, #FFB6C1)' : '#666'};
        color: ${isUnlocked ? '#fff' : '#ccc'};
        padding: 8px 12px;
        border-radius: 20px;
        margin: 5px;
        font-size: 0.8em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: ${isUnlocked ? '0 4px 15px rgba(255, 20, 147, 0.4)' : 'none'};
    `;

    badge.innerHTML = `
        ${achievement.badgeIcon || '🏆'} ${achievement.title}
        ${isUnlocked ? ' ✓' : ''}
    `;

    badge.title = achievement.description;
    badge.onclick = () => {
        window.location.href = 'achievements.html';
    };

    return badge;
}

// Add achievement badges to profile or other pages
function displayCustomerAchievements(customerId, containerId) {
    if (!customerId || !containerId) return;

    fetch(`/api/achievements/customer/${customerId}/unlocked`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const container = document.getElementById(containerId);
                if (!container) return;

                container.innerHTML = '<h4>🏆 Your Achievements</h4>';
                
                if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
                    data.unlockedAchievements.forEach(ca => {
                        const badge = createAchievementBadge(ca.achievement, true);
                        container.appendChild(badge);
                    });
                    
                    const viewAllBtn = document.createElement('button');
                    viewAllBtn.textContent = 'View All Achievements';
                    viewAllBtn.style.cssText = `
                        background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                        margin-top: 10px;
                        display: block;
                        font-weight: bold;
                    `;
                    viewAllBtn.onclick = () => window.location.href = 'achievements.html';
                    container.appendChild(viewAllBtn);
                } else {
                    container.innerHTML += '<p>No achievements unlocked yet. Start shopping to earn your first achievement!</p>';
                }
            }
        })
        .catch(error => console.error('Error loading achievements:', error));
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AchievementNotifier,
        achievementNotifier,
        checkAchievementsAfterOrder,
        checkAchievementsAfterRegistration,
        displayCustomerAchievements
    };
}