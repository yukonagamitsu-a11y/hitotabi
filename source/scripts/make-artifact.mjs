// dist/ の JS と CSS を1枚の HTML(公開用)にまとめる: node scripts/make-artifact.mjs
import fs from 'node:fs'
const dir = 'dist/assets/'
const files = fs.readdirSync(dir)
const css = fs.readFileSync(dir + files.find((f) => f.endsWith('.css')), 'utf8')
const js = fs.readFileSync(dir + files.find((f) => f.endsWith('.js')), 'utf8').replaceAll('</script', '<\\/script')
const html = `<title>ひとたび</title>\n<style>${css}</style>\n<div id="root"></div>\n<script type="module">${js}</script>\n`
fs.writeFileSync('dist/tabi-note.html', html)
console.log('dist/tabi-note.html', (html.length / 1024).toFixed(0) + ' KB')
