class MoodStats {
    constructor(moodTracker) {
        this.moodTracker = moodTracker;
        this.chart = null;
        this.initializeChart();
    }

    calculateStats() {
        const history = this.moodTracker.moodHistory;
        const last30Days = history.slice(-30);
        
        const stats = {
            averageMood: this.calculateAverageMood(last30Days),
            moodCounts: this.getMoodCounts(last30Days),
            trends: this.analyzeTrends(last30Days),
            streaks: this.calculateStreaks(last30Days)
        };

        return stats;
    }

    initializeChart() {
        const ctx = document.getElementById('moodChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Mood Level',
                    data: [],
                    borderColor: 'rgb(125, 125, 179)',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 1,
                        max: 5,
                        ticks: {
                            callback: function(value) {
                                return ['Awful', 'Down', 'Okay', 'Good', 'Great'][value-1];
                            }
                        }
                    }
                }
            }
        });
    }

    updateChart() {
        const last7Days = this.moodTracker.moodHistory.slice(-7);
        const moodValues = {
            'great': 5,
            'good': 4,
            'okay': 3,
            'down': 2,
            'awful': 1
        };

        this.chart.data.labels = last7Days.map(entry => 
            new Date(entry.timestamp).toLocaleDateString()
        );
        this.chart.data.datasets[0].data = last7Days.map(entry => 
            moodValues[entry.mood]
        );
        this.chart.update();
    }

    analyzeTrends(entries) {
        if (entries.length < 2) return 'Not enough data';
        
        const moodValues = {
            'great': 5, 'good': 4, 'okay': 3, 'down': 2, 'awful': 1
        };
        
        const values = entries.map(entry => moodValues[entry.mood]);
        const trend = this.calculateTrendDirection(values);
        
        return {
            direction: trend,
            message: this.getTrendMessage(trend)
        };
    }

    calculateTrendDirection(values) {
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / values.length;
        
        const recentAvg = values.slice(-3).reduce((a, b) => a + b, 0) / 3;
        
        if (recentAvg > mean + 0.5) return 'improving';
        if (recentAvg < mean - 0.5) return 'declining';
        return 'stable';
    }

    getTrendMessage(trend) {
        const messages = {
            'improving': "Your mood seems to be improving! Keep up the good work!",
            'declining': "Your mood appears to be lower lately. Consider talking to someone or trying some self-care activities.",
            'stable': "Your mood has been relatively stable."
        };
        return messages[trend];
    }

    calculateAverageMood(entries) {
        if (entries.length === 0) return null;
        
        const moodValues = {
            'great': 5, 'good': 4, 'okay': 3, 'down': 2, 'awful': 1
        };
        
        const sum = entries.reduce((acc, entry) => acc + moodValues[entry.mood], 0);
        return (sum / entries.length).toFixed(1);
    }

    getMoodCounts(entries) {
        return entries.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});
    }

    calculateStreaks(entries) {
        if (entries.length === 0) return { current: 0, best: 0 };
        
        let currentStreak = 1;
        let bestStreak = 1;
        const goodMoods = ['great', 'good'];
        
        for (let i = 1; i < entries.length; i++) {
            if (goodMoods.includes(entries[i].mood) && 
                goodMoods.includes(entries[i-1].mood)) {
                currentStreak++;
                bestStreak = Math.max(bestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        
        return { current: currentStreak, best: bestStreak };
    }

    generateInsights() {
        const stats = this.calculateStats();
        const insights = [];
        
        // Add mood pattern insights
        if (stats.trends.direction === 'improving') {
            insights.push({
                type: 'positive',
                message: "You're showing great progress! Your mood has been trending upward."
            });
        } else if (stats.trends.direction === 'declining') {
            insights.push({
                type: 'supportive',
                message: "It seems you've been having a tough time lately. Remember it's okay to reach out for help."
            });
        }
        
        // Add streak insights
        if (stats.streaks.current > 3) {
            insights.push({
                type: 'achievement',
                message: `You're on a ${stats.streaks.current}-day streak of positive moods!`
            });
        }
        
        // Add time-based patterns
        const timePatterns = this.analyzeTimePatterns();
        if (timePatterns.bestTime) {
            insights.push({
                type: 'tip',
                message: `You tend to feel best during ${timePatterns.bestTime}. Consider scheduling important activities during these times.`
            });
        }
        
        return insights;
    }

    analyzeTimePatterns() {
        const timeSlots = {
            morning: [],
            afternoon: [],
            evening: []
        };
        
        this.moodTracker.moodHistory.forEach(entry => {
            const hour = new Date(entry.timestamp).getHours();
            if (hour >= 5 && hour < 12) timeSlots.morning.push(entry);
            else if (hour >= 12 && hour < 18) timeSlots.afternoon.push(entry);
            else timeSlots.evening.push(entry);
        });
        
        // Calculate average mood for each time slot
        const averages = {};
        for (const [slot, entries] of Object.entries(timeSlots)) {
            if (entries.length > 0) {
                averages[slot] = this.calculateAverageMood(entries);
            }
        }
        
        // Find best time of day
        let bestTime = null;
        let bestScore = 0;
        for (const [slot, avg] of Object.entries(averages)) {
            if (avg > bestScore) {
                bestScore = avg;
                bestTime = slot;
            }
        }
        
        return { bestTime, averages };
    }

    updateDisplay() {
        const stats = this.calculateStats();
        this.updateChart();
        
        // Update trend message
        const trendElement = document.getElementById('trendMessage');
        trendElement.className = `trend-${stats.trends.direction}`;
        trendElement.textContent = stats.trends.message;
        
        // Update common mood
        const commonMoodElement = document.getElementById('commonMood');
        const moodCounts = stats.moodCounts;
        const mostCommon = Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])[0];
        if (mostCommon) {
            commonMoodElement.innerHTML = `
                <div class="mood-emoji">${this.moodTracker.moods[mostCommon[0]].emoji}</div>
                <div class="mood-label">${mostCommon[0]}</div>
            `;
        }
        
        // Update insights
        const insights = this.generateInsights();
        const insightsElement = document.getElementById('moodInsights');
        insightsElement.innerHTML = insights
            .map(insight => `
                <div class="insight-card ${insight.type}">
                    ${insight.message}
                </div>
            `)
            .join('');
    }
} 