from pathlib import Path

path = Path(r"d:\SocialMedia Marketing\frontend\graduation-project-FE-2\src\features\dashboard\ownerDashboard\components\campaigns\create\GeneratedCampaignStrategy.jsx")
lines = path.read_text(encoding="utf-8").splitlines()

# Replace mistaken </motion.div> with </div> when stack doesn't match - brute fix known bad patterns
content = path.read_text(encoding="utf-8")
# All layout wrappers that aren't motion animated should be div
replacements = [
    ('<motion.div className="flex flex-wrap', '<motion.div className="flex flex-wrap'),  # keep first hero - actually change to div
]
# Simpler: replace ALL </motion.div> that break build - read file and fix line by line with a stack

out = []
stack = []
for i, line in enumerate(content.splitlines()):
    stripped = line.strip()
    if stripped.startswith('<motion.div') and 'initial=' not in line and 'animate=' not in line and 'whileHover' not in line:
        # layout motion.div -> div
        line = line.replace('<motion.div', '<div', 1)
        stack.append('motion_open_div')
    elif stripped.startswith('<div') and not stripped.startswith('</'):
        stack.append('motion.div')
    elif stripped == '</motion.div>':
        if stack and stack[-1] == 'motion_open_div':
            line = line.replace('</motion.div>', '</motion.div>', 1)
            line = '</div>'
            stack.pop()
        elif stack:
            stack.pop()
    elif stripped == '</motion.div>':
        pass
    out.append(line)

path.write_text('\n'.join(out) + '\n', encoding='utf-8')
print('wrote', len(out), 'lines')
