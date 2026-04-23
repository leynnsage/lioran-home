/**
 * 轻量 Markdown 渲染器
 * 支持：标题、粗体、斜体、代码块、行内代码、列表、引用、链接、表格
 */

// 转义 HTML
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '"')
}

// 处理行内格式
function parseInline(text) {
  return escapeHtml(text)
    // 粗体+斜体
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-accent underline">$1</a>')
}

/**
 * 将 Markdown 文本解析为 HTML
 */
export function renderMarkdown(text) {
  if (!text) return ''

  const lines = text.split('\n')
  const result = []
  let inCodeBlock = false
  let codeContent = ''
  let codeLang = ''
  let inList = false
  let inBlockquote = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 代码块开始/结束
    if (line.trimStart().startsWith('```')) {
      if (inCodeBlock) {
        // 结束代码块
        result.push(
          `<div class="code-block"><div class="code-header"><span class="code-lang">${escapeHtml(codeLang || 'code')}</span><button class="code-copy" onclick="navigator.clipboard.writeText(this.closest('.code-block').querySelector('code').textContent)">复制</button></div><pre><code>${escapeHtml(codeContent.trimEnd())}</code></pre></div>`
        )
        inCodeBlock = false
        codeContent = ''
        codeLang = ''
      } else {
        // 开始代码块
        if (inList) { result.push('</ul>'); inList = false }
        if (inBlockquote) { result.push('</blockquote>'); inBlockquote = false }
        inCodeBlock = true
        codeLang = line.trimStart().slice(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeContent += line + '\n'
      continue
    }

    // 空行
    if (line.trim() === '') {
      if (inList) { result.push('</ul>'); inList = false }
      if (inBlockquote) { result.push('</blockquote>'); inBlockquote = false }
      continue
    }

    // 标题
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      if (inList) { result.push('</ul>'); inList = false }
      const level = headingMatch[1].length
      const sizes = { 1: 'text-lg', 2: 'text-base', 3: 'text-sm', 4: 'text-sm', 5: 'text-xs', 6: 'text-xs' }
      result.push(`<h${level} class="${sizes[level]} font-semibold text-ink mt-3 mb-1">${parseInline(headingMatch[2])}</h${level}>`)
      continue
    }

    // 引用
    if (line.startsWith('> ')) {
      if (!inBlockquote) {
        if (inList) { result.push('</ul>'); inList = false }
        result.push('<blockquote class="border-l-2 border-accent/30 pl-3 my-1">')
        inBlockquote = true
      }
      result.push(`<p class="text-ink-light text-sm">${parseInline(line.slice(2))}</p>`)
      continue
    } else if (inBlockquote) {
      result.push('</blockquote>')
      inBlockquote = false
    }

    // 无序列表
    if (line.match(/^[\s]*[-*+]\s+/)) {
      if (!inList) {
        result.push('<ul class="list-disc pl-5 my-1 space-y-0.5">')
        inList = true
      }
      const content = line.replace(/^[\s]*[-*+]\s+/, '')
      result.push(`<li class="text-sm text-ink">${parseInline(content)}</li>`)
      continue
    }

    // 有序列表
    if (line.match(/^[\s]*\d+\.\s+/)) {
      if (!inList) {
        result.push('<ul class="list-decimal pl-5 my-1 space-y-0.5">')
        inList = true
      }
      const content = line.replace(/^[\s]*\d+\.\s+/, '')
      result.push(`<li class="text-sm text-ink">${parseInline(content)}</li>`)
      continue
    }

    if (inList) { result.push('</ul>'); inList = false }

    // 分割线
    if (line.match(/^[-*_]{3,}$/)) {
      result.push('<hr class="border-paper-200 my-3" />')
      continue
    }

    // 普通段落
    result.push(`<p class="text-sm text-ink leading-relaxed my-1">${parseInline(line)}</p>`)
  }

  // 关闭未关闭的标签
  if (inCodeBlock) {
    result.push(`<div class="code-block"><div class="code-header"><span class="code-lang">${escapeHtml(codeLang || 'code')}</span></div><pre><code>${escapeHtml(codeContent.trimEnd())}</code></pre></div>`)
  }
  if (inList) result.push('</ul>')
  if (inBlockquote) result.push('</blockquote>')

  return result.join('\n')
}