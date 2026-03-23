const fs = require('fs');
const path = require('path');

const dir = __dirname;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

const emojiMap = {
    '🏠': '<i data-lucide="home" class="nav-icon"></i>',
    '📁': '<i data-lucide="folder" class="nav-icon"></i>',
    '💡': '<i data-lucide="lightbulb" class="nav-icon"></i>',
    '⚡': '<i data-lucide="zap" class="nav-icon"></i>',
    '☑️': '<i data-lucide="check-square" class="nav-icon"></i>',
    '🌐': '<i data-lucide="globe" class="nav-icon"></i>',
    '✍️': '<i data-lucide="pen-tool" class="nav-icon"></i>',
    '👤': '<i data-lucide="user" class="nav-icon"></i>',
    '🔔': '<i data-lucide="bell" class="nav-icon"></i>',
    '⚙️': '<i data-lucide="settings" class="nav-icon"></i>',
    '📝': '<i data-lucide="file-text" class="nav-icon" style="color: var(--primary-color)"></i>',
    '☀️': '<i data-lucide="sun" class="nav-icon"></i>',
    '🌙': '<i data-lucide="moon" class="nav-icon"></i>',
    '🌤️': '<i data-lucide="cloud-sun" class="nav-icon"></i>',
    '🔍': '<i data-lucide="search" class="nav-icon"></i>',
    '➕': '<i data-lucide="plus" class="nav-icon"></i>',
    '🕒': '<i data-lucide="clock" class="nav-icon"></i>',
    '📈': '<i data-lucide="trending-up" class="nav-icon"></i>',
    '✨': '<i data-lucide="sparkles" class="nav-icon"></i>',
    '👍': '<i data-lucide="thumbs-up" class="nav-icon"></i>',
    '💬': '<i data-lucide="message-square" class="nav-icon"></i>',
    '📑': '<i data-lucide="bookmark" class="nav-icon"></i>',
    '👨‍💻': '<i data-lucide="user" class="nav-icon"></i>',
    '👩‍🔬': '<i data-lucide="user" class="nav-icon"></i>',
    '👨‍🎨': '<i data-lucide="user" class="nav-icon"></i>',
    '👨‍🎓': '<i data-lucide="user" class="nav-icon"></i>',
    '⭐': '<i data-lucide="star" class="nav-icon"></i>',
    '🏆': '<i data-lucide="award" class="nav-icon"></i>',
    '🚀': '<i data-lucide="rocket" class="nav-icon"></i>',
    '🔥': '<i data-lucide="flame" class="nav-icon"></i>',
    '📊': '<i data-lucide="bar-chart-2" class="nav-icon"></i>',
    '📂': '<i data-lucide="folder-open" class="nav-icon"></i>',
    '✅': '<i data-lucide="check-circle" class="nav-icon"></i>',
    '❌': '<i data-lucide="x-circle" class="nav-icon"></i>',
    '🗑️': '<i data-lucide="trash-2" class="nav-icon"></i>',
    '✏️': '<i data-lucide="edit-2" class="nav-icon"></i>',
    '🔗': '<i data-lucide="link" class="nav-icon"></i>',
    '👑': '<i data-lucide="crown" class="nav-icon"></i>',
    '📅': '<i data-lucide="calendar" class="nav-icon"></i>'
};

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let changed = false;

    // Add Lucide script to head if not present
    if (!content.includes('unpkg.com/lucide')) {
        content = content.replace('</head>', '    <script src="https://unpkg.com/lucide@latest"></script>\n</head>');
        changed = true;
    }

    // Add lucide.createIcons(); before </body> or inside the main script if suitable
    if (!content.includes('lucide.createIcons()')) {
        // Find last script tag or </body>
        content = content.replace('</body>', `    <script>\n        if(typeof lucide !== 'undefined') { lucide.createIcons(); }\n    </script>\n</body>`);
        changed = true;
    }

    // Replace emojis
    Object.keys(emojiMap).forEach(emoji => {
        // we use split join for fast global replace
        if (content.includes(emoji)) {
            content = content.split(emoji).join(emojiMap[emoji]);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log(`Updated ${file}`);
    }
});

console.log("Done refactoring emojis and appending Lucide scripts.");
