class MoodExport {
    constructor(moodTracker, moodStats) {
        this.moodTracker = moodTracker;
        this.moodStats = moodStats;
        this.initializeExportButton();
    }

    initializeExportButton() {
        const exportButton = document.createElement('button');
        exportButton.className = 'export-button';
        exportButton.innerHTML = `
            <span class="export-icon">📊</span>
            Export Mood Data
        `;
        exportButton.addEventListener('click', () => this.showExportOptions());
        
        // Add button to mood statistics section
        document.querySelector('.mood-statistics').appendChild(exportButton);
    }

    showExportOptions() {
        const modal = document.createElement('div');
        modal.className = 'export-modal';
        modal.innerHTML = `
            <div class="export-modal-content">
                <h3>Export Your Mood Data</h3>
                <div class="export-options">
                    <button class="export-option" data-format="json">
                        <span class="format-icon">{ }</span>
                        JSON Format
                        <span class="format-desc">Raw data for backup</span>
                    </button>
                    <button class="export-option" data-format="csv">
                        <span class="format-icon">📝</span>
                        CSV Format
                        <span class="format-desc">Open in spreadsheet</span>
                    </button>
                    <button class="export-option" data-format="pdf">
                        <span class="format-icon">📄</span>
                        PDF Report
                        <span class="format-desc">Detailed analysis</span>
                    </button>
                </div>
                <button class="close-modal">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelectorAll('.export-option').forEach(button => {
            button.addEventListener('click', () => {
                const format = button.dataset.format;
                this.exportData(format);
                modal.remove();
            });
        });
    }

    exportData(format) {
        switch (format) {
            case 'json':
                this.exportJSON();
                break;
            case 'csv':
                this.exportCSV();
                break;
            case 'pdf':
                this.exportPDF();
                break;
        }
    }

    exportJSON() {
        const data = {
            moodHistory: this.moodTracker.moodHistory,
            stats: this.moodStats.calculateStats(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, 'mood-data.json');
    }

    exportCSV() {
        const headers = ['Date', 'Mood', 'Note'];
        const rows = this.moodTracker.moodHistory.map(entry => [
            new Date(entry.timestamp).toLocaleDateString(),
            entry.mood,
            entry.note
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        this.downloadFile(blob, 'mood-data.csv');
    }

    async exportPDF() {
        // Using jsPDF for PDF generation
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Mood Tracking Report', 20, 20);
        
        // Add date range
        const dateRange = this.getDateRange();
        doc.setFontSize(12);
        doc.text(`Report Period: ${dateRange}`, 20, 30);
        
        // Add mood statistics
        const stats = this.moodStats.calculateStats();
        doc.setFontSize(14);
        doc.text('Mood Statistics', 20, 50);
        
        // Add mood distribution
        let yPos = 60;
        Object.entries(stats.moodCounts).forEach(([mood, count]) => {
            doc.setFontSize(12);
            doc.text(`${mood}: ${count} times`, 30, yPos);
            yPos += 10;
        });
        
        // Add insights
        yPos += 10;
        doc.setFontSize(14);
        doc.text('Insights', 20, yPos);
        
        const insights = this.moodStats.generateInsights();
        insights.forEach(insight => {
            yPos += 15;
            doc.setFontSize(12);
            doc.text(insight.message, 30, yPos, { maxWidth: 150 });
        });
        
        this.downloadFile(doc.output('blob'), 'mood-report.pdf');
    }

    getDateRange() {
        const history = this.moodTracker.moodHistory;
        if (history.length === 0) return 'No data';
        
        const firstDate = new Date(history[0].timestamp);
        const lastDate = new Date(history[history.length - 1].timestamp);
        
        return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        a.remove();
    }
} 