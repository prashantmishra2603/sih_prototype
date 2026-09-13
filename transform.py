import re

with open('frontend/src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Variables redesign
variables_replacement = """:root {
  --bg-primary: #12151c;
  --bg-secondary: #1a1e27;
  --bg-card: #1e232e;
  --bg-card-hover: #242a38;
  --bg-glass: #1e232e;
  --border: rgba(255, 255, 255, 0.08);
  --border-active: #E28A75;

  --blue: #809E86;
  --blue-light: #9ab6a0;
  --blue-dark: #68846d;
  --cyan: #809E86;
  --cyan-light: #9ab6a0;
  --purple: #809E86;
  --green: #506F50;
  --green-light: #678c67;
  --green-glow: #3c543c;
  --amber: #d97706;
  --red: #E28A75;
  --red-light: #eba494;

  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;

  --font-main: 'Inter', sans-serif;
  --font-display: 'Inter', sans-serif;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.2);
}"""
css = re.sub(r':root\s*\{.*?(?=\n\s*\})\}', variables_replacement + '\n}', css, flags=re.DOTALL)

# 2. Body background
body_bg = """body {
  font-family: var(--font-main);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}"""
css = re.sub(r'body\s*\{.*?(?=\n\s*\})\}', body_bg + '\n}', css, flags=re.DOTALL)

# 3. Clean up glassmorphism and excessive shadows everywhere
css = re.sub(r'backdrop-filter:\s*blur\([^)]+\);?', '', css)
css = re.sub(r'-webkit-backdrop-filter:\s*blur\([^)]+\);?', '', css)
css = re.sub(r'box-shadow:\s*0\s+0\s+\d+px\s+rgba\([^)]+\).*?;', 'box-shadow: var(--shadow-card);', css)

# 4. Buttons (make them clean and minimal)
btn_primary = """.btn-primary {
  background: var(--red);
  color: #12151c;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(226, 138, 117, 0.2);
  border: 1px solid var(--red);
}
.btn-primary:hover {
  transform: translateY(-1px);
  background: var(--red-light);
  box-shadow: 0 4px 12px rgba(226, 138, 117, 0.3);
  border-color: var(--red-light);
}"""
css = re.sub(r'\.btn-primary\s*\{.*?(?=\n\s*\})\}', btn_primary + '\n}', css, flags=re.DOTALL)
css = re.sub(r'\.btn-primary:hover\s*\{.*?(?=\n\s*\})\}', '', css, flags=re.DOTALL)

btn_success = """.btn-success {
  background: var(--green);
  color: #ffffff;
  border: 1px solid var(--green);
}
.btn-success:hover {
  background: var(--green-light);
  border-color: var(--green-light);
}"""
css = re.sub(r'\.btn-success\s*\{.*?(?=\n\s*\})\}', btn_success + '\n}', css, flags=re.DOTALL)
css = re.sub(r'\.btn-success:hover\s*\{.*?(?=\n\s*\})\}', '', css, flags=re.DOTALL)

# Replace gradients in gradient-text
css = re.sub(r'linear-gradient\(135deg,\s*#34d399.*?\)', 'var(--red)', css)
css = re.sub(r'linear-gradient\(135deg,\s*#6ee7b7.*?\)', 'var(--green)', css)

# 5. Clean Card
card_css = """.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: all 0.2s ease;
}
.card:hover {
  border-color: var(--border-active);
  box-shadow: var(--shadow-card);
}"""
css = re.sub(r'\.card\s*\{.*?(?=\n\s*\})\}', card_css + '\n}', css, flags=re.DOTALL)
css = re.sub(r'\.card:hover\s*\{.*?(?=\n\s*\})\}', '', css, flags=re.DOTALL)

# Generic replace of green primary colors to Coral in other hardcoded places
css = re.sub(r'rgba\(16,\s*185,\s*129', 'rgba(226, 138, 117', css)
css = re.sub(r'rgba\(52,\s*211,\s*153', 'rgba(226, 138, 117', css)
css = re.sub(r'rgba\(5,\s*150,\s*105', 'rgba(226, 138, 117', css)
css = re.sub(r'#10b981', '#E28A75', css) # green to coral
css = re.sub(r'#059669', '#E28A75', css)
css = re.sub(r'#34d399', '#eba494', css) # light green to light coral
css = re.sub(r'#6ee7b7', '#eba494', css)

# Replace generic blues to Dolphin Gray
css = re.sub(r'#3b82f6', '#809E86', css)
css = re.sub(r'#60a5fa', '#9ab6a0', css)
css = re.sub(r'#06b6d4', '#809E86', css)
css = re.sub(r'rgba\(59,\s*130,\s*246', 'rgba(128, 158, 134', css)

with open('frontend/src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Done transforming index.css")
