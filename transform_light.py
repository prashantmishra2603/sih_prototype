import re
import os

filepath = 'frontend/src/index.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Light Theme Variables
light_variables = """:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  --bg-card-hover: #f1f5f9;
  --bg-glass: rgba(255, 255, 255, 0.9);
  --border: #e2e8f0;
  --border-active: #0f172a;

  --blue: #3b82f6;
  --blue-light: #60a5fa;
  --blue-dark: #1d4ed8;
  --cyan: #06b6d4;
  --cyan-light: #67e8f9;
  --purple: #8b5cf6;
  --green: #10b981;
  --green-light: #34d399;
  --green-glow: #059669;
  --amber: #f59e0b;
  --red: #ef4444;
  --red-light: #f87171;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;

  --font-main: 'Inter', sans-serif;
  --font-display: 'Inter', sans-serif;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05);
}"""
css = re.sub(r':root\s*\{.*?(?=\n\s*\})\}', light_variables + '\n}', css, flags=re.DOTALL)

# 2. Update Topbar
topbar_css = """.topbar {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  padding: 0 32px;
  height: 64px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}
.topbar-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.topbar-actions-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.topbar-actions-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}"""
css = re.sub(r'\.topbar\s*\{.*?z-index:\s*10;\s*\}', topbar_css, css, flags=re.DOTALL)
css = re.sub(r'\.topbar-actions\s*\{.*?\}', '', css, flags=re.DOTALL)

# 3. Clean up Buttons for Light Theme
btn_primary = """.btn-primary {
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
  border: 1px solid #0f172a;
}
.btn-primary:hover {
  transform: translateY(-1px);
  background: #1e293b;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  border-color: #1e293b;
}"""
css = re.sub(r'\.btn-primary\s*\{.*?(?=\n\s*\})\}', btn_primary + '\n}', css, flags=re.DOTALL)

# 4. Clean up Topbar Buttons
topbar_btn = """.topbar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  background: #ffffff;
  color: var(--text-primary);
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.topbar-btn:hover {
  background: var(--bg-secondary);
  border-color: #cbd5e1;
}
.topbar-btn.primary {
  background: #0f172a;
  color: #ffffff;
  border: none;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
}
.topbar-btn.primary:hover {
  transform: translateY(-1px);
  background: #1e293b;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}"""
css = re.sub(r'\.topbar-btn\s*\{.*?(?=\n\s*\})\}', topbar_btn + '\n}', css, flags=re.DOTALL)
css = re.sub(r'\.topbar-btn:hover\s*\{.*?(?=\n\s*\})\}', '', css, flags=re.DOTALL)
css = re.sub(r'\.topbar-btn\.primary\s*\{.*?(?=\n\s*\})\}', '', css, flags=re.DOTALL)
css = re.sub(r'\.topbar-btn\.primary:hover\s*\{.*?(?=\n\s*\})\}', '', css, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print("Light Theme applied successfully.")
