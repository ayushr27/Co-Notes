const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontendv1', 'document.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace empty state icons
content = content.replace(
  /<div class="empty-icon">.*?<\/div>/s,
  '<div class="empty-icon">${state.query ? \'<i data-lucide="search" style="width: 48px; height: 48px;"></i>\' : state.section === "archived" ? \'<i data-lucide="package" style="width: 48px; height: 48px;"></i>\' : \'<i data-lucide="file-text" style="width: 48px; height: 48px;"></i>\'}</div>'
);

// Add the lucide render call right after the empty state HTML
content = content.replace(
  /<div class="empty-sub">.*?<\/div>\s*<\/div>\s*`;\s*return;/s,
  '<div class="empty-sub">${state.query ? "Try a different search term" : "Press Ctrl+N or the + button to create your first note."}</div>\n          </div>\n        `;\n        setTimeout(() => lucide.createIcons(), 50);\n        return;'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed empty state icons in document.html');
