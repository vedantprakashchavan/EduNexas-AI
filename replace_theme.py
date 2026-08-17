import os
import re

files = [
    r"c:\Users\ADITYA KONDA\OneDrive\Documents\Desktop\EduNexus-AI\client\src\pages\dashboard\DashboardPage.tsx",
    r"c:\Users\ADITYA KONDA\OneDrive\Documents\Desktop\EduNexus-AI\client\src\pages\students\StudentsPage.tsx",
    r"c:\Users\ADITYA KONDA\OneDrive\Documents\Desktop\EduNexus-AI\client\src\pages\teachers\TeachersPage.tsx",
    r"c:\Users\ADITYA KONDA\OneDrive\Documents\Desktop\EduNexus-AI\client\src\pages\classes\ClassesPage.tsx"
]

def replace_classes(content):
    # Backgrounds
    content = re.sub(r'bg-slate-950', 'bg-white', content)
    content = re.sub(r'bg-slate-900/50', 'bg-white', content)
    content = re.sub(r'bg-slate-900/30', 'bg-white', content)
    content = re.sub(r'bg-slate-900', 'bg-white', content) # general modals
    content = re.sub(r'backdrop-blur-sm', '', content)
    content = re.sub(r'backdrop-blur-xl', '', content)
    
    # Notice that empty spaces might be left behind but that's fine.
    
    content = re.sub(r'bg-slate-800/50', 'bg-[#F7F7F7]', content)
    content = re.sub(r'bg-slate-800/40', 'bg-[#F7F7F7]', content)
    content = re.sub(r'bg-slate-800/30', 'bg-[#F7F7F7]', content)
    content = re.sub(r'bg-slate-800/20', 'bg-[#F7F7F7]', content)
    content = re.sub(r'bg-slate-800/80', 'bg-[#F7F7F7]', content)
    content = re.sub(r'bg-slate-800\b', 'bg-[#F7F7F7]', content)

    # Borders
    content = re.sub(r'border-slate-800/60', 'border-[#EAEAEA]', content)
    content = re.sub(r'border-slate-800/40', 'border-[#EAEAEA]', content)
    content = re.sub(r'border-slate-700/60', 'border-[#EAEAEA]', content)
    content = re.sub(r'border-slate-700/50', 'border-[#EAEAEA]', content)
    content = re.sub(r'border-slate-700/40', 'border-[#EAEAEA]', content)
    content = re.sub(r'border-slate-700/30', 'border-[#EAEAEA]', content)
    content = re.sub(r'border-slate-800', 'border-[#EAEAEA]', content)
    content = re.sub(r'divide-slate-800/40', 'divide-[#F0F0F0]', content)
    content = re.sub(r'divide-slate-800/60', 'divide-[#F0F0F0]', content)

    # Text
    content = re.sub(r'text-white', 'text-[#111111]', content)
    content = re.sub(r'text-slate-300', 'text-[#333333]', content)
    content = re.sub(r'text-slate-400', 'text-[#666666]', content)
    content = re.sub(r'text-slate-500', 'text-[#8A8A8A]', content)
    content = re.sub(r'text-slate-600', 'text-[#999999]', content)

    # Accent Colors (general)
    content = re.sub(r'bg-indigo-500/10', 'bg-[#F7F7F7]', content)
    content = re.sub(r'bg-indigo-500/20', 'bg-[#F7F7F7]', content)
    content = re.sub(r'bg-violet-500/10', 'bg-[#F7F7F7]', content)
    
    # For text-indigo-400 we only want to change it if it's not part of the active buttons or specific things.
    content = re.sub(r'text-indigo-400', 'text-[#111111]', content)
    content = re.sub(r'text-indigo-300', 'text-[#111111]', content)
    content = re.sub(r'text-violet-400', 'text-[#111111]', content)
    
    # Status Badges
    content = re.sub(r'text-emerald-400', 'text-emerald-600', content)
    content = re.sub(r'bg-emerald-500/10', 'bg-emerald-50', content)
    content = re.sub(r'text-rose-400', 'text-red-600', content)
    content = re.sub(r'bg-rose-500/10', 'bg-red-50', content)
    content = re.sub(r'text-amber-400', 'text-amber-600', content)
    content = re.sub(r'bg-amber-500/10', 'bg-amber-50', content)
    content = re.sub(r'text-blue-400', 'text-blue-600', content)
    content = re.sub(r'bg-blue-500/10', 'bg-blue-50', content)
    
    # BUTTONS
    content = re.sub(r'bg-gradient-to-r from-indigo-500 to-violet-600', 'bg-[#111111]', content)
    content = re.sub(r'hover:from-indigo-600 hover:to-violet-700', 'hover:bg-[#1A1A1A]', content)
    content = re.sub(r'hover:shadow-indigo-500/20', 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]', content)
    
    # Re-fix the "text-[#111111]" in buttons to "text-white"
    # Search for button containing bg-[#111111] text-[#111111]
    content = re.sub(r'(bg-\[#111111\].*?)text-\[#111111\]', r'\1text-white', content)
    content = re.sub(r'(class.*?bg-\[#111111\].*?)text-\[#111111\]', r'\1text-white', content)

    # Tables & Cards
    content = re.sub(r'rounded-xl border border-\[#EAEAEA\] bg-white', 'rounded-2xl border border-[#EAEAEA] bg-white', content)
    # The actual order might have been messed up by replacements. Let's do rounded-xl -> rounded-2xl for cards.
    content = re.sub(r'rounded-xl border border-\[#EAEAEA\] bg-white', 'rounded-2xl border border-[#EAEAEA] bg-white', content)

    # Modals
    content = re.sub(r'bg-black/60', 'bg-black/40', content)

    # Inputs
    content = re.sub(r'focus:ring-indigo-500/30', 'focus:ring-[#111111]/10 focus:border-[#DCDCDC]', content)
    content = re.sub(r'focus:border-indigo-500/50', 'focus:border-[#DCDCDC]', content)

    # Dashboard Charts
    content = re.sub(r'bg-gradient-to-t from-indigo-600 to-violet-500', 'bg-[#111111]', content)
    content = re.sub(r'stroke="#6366f1"', 'stroke="#111111"', content)
    content = re.sub(r'stopColor="#6366f1"', 'stopColor="#111111"', content)
    content = re.sub(r'fill="#8b5cf6"', 'fill="#111111"', content)
    content = re.sub(r'fill="#1e293b"', 'fill="#EAEAEA"', content) # pending bars
    content = re.sub(r'stroke="#1e293b"', 'stroke="#EAEAEA"', content) # cartesian grid
    content = re.sub(r'fill: \'#64748b\'', 'fill: \'#8A8A8A\'', content)
    content = re.sub(r"backgroundColor: '#0f172a'", "backgroundColor: '#ffffff'", content)
    content = re.sub(r"border: '1px solid #1e293b'", "border: '1px solid #EAEAEA'", content)
    content = re.sub(r"color: '#fff'", "color: '#111111'", content)
    
    # Avatars in tables (student/teacher)
    content = re.sub(r'bg-gradient-to-br flex', 'bg-[#F7F7F7] flex', content)
    content = re.sub(r'avatarColors\[i % avatarColors\.length\]', '""', content)
    # the text color for avatars should be #111111
    content = re.sub(r'text-\[#111111\] text-sm font-bold', 'text-[#111111] text-sm font-bold', content) # handled by text-white -> text-[#111111]
    
    # Specific fix for ClassesPage Gradients
    content = re.sub(r'gradientAccents = \[.*?\];', "gradientAccents = ['from-[#111111] to-[#333333]'];", content)
    content = re.sub(r'iconColors = \[.*?\];', "iconColors = ['text-[#111111]'];", content)
    
    content = re.sub(r'bg-slate-800/80 flex', 'bg-[#F7F7F7] flex', content)

    # Animation
    content = re.sub(r'animate-in fade-in duration-500', 'animate-in fade-in duration-300', content)
    content = re.sub(r'animate-pulse', '', content)
    
    return content

for fpath in files:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = replace_classes(content)
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {fpath}")
    else:
        print(f"File not found: {fpath}")
