// scripts/codetabs.js
hexo.extend.tag.register('codetabs', function(args, content) {
    // 解析内部 {% code lang %} ... {% endcode %} 块
    const codeBlocks = [];
    const regex = /{%\s*code\s+(\w+)\s*%}([\s\S]*?){%\s*endcode\s*%}/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const lang = match[1];
        const code = match[2].trim();
        codeBlocks.push({ lang, code });
    }

    if (codeBlocks.length === 0) return '';

    // 生成选项卡导航
    let nav = '<div class="code-tabs-nav">';
    codeBlocks.forEach((block, idx) => {
        const active = idx === 0 ? 'active' : '';
        nav += `<button class="code-tab ${active}" data-lang="${block.lang}">${block.lang.toUpperCase()}</button>`;
    });
    nav += '</div>';

    // 生成代码块内容
    let contentHtml = '<div class="code-tabs-content">';
    codeBlocks.forEach((block, idx) => {
        const active = idx === 0 ? 'active' : '';
        contentHtml += `
      <div class="code-block ${active}" data-lang="${block.lang}">
        <pre><code class="language-${block.lang}">${escapeHtml(block.code)}</code></pre>
      </div>
    `;
    });
    contentHtml += '</div>';

    return `<div class="code-tabs">${nav}${contentHtml}</div>`;
}, { ends: true });

// 简单的 HTML 转义，防止代码中的特殊字符破坏结构
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}