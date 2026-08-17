const fs = require('fs');
const path = require('path');

const basePath = process.cwd();
const files = [
  'client/src/pages/subjects/SubjectsPage.tsx',
  'client/src/pages/timetable/TimetablePage.tsx',
  'client/src/pages/attendance/AttendancePage.tsx',
  'client/src/pages/exams/ExamsPage.tsx',
  'client/src/pages/fees/FeesPage.tsx',
  'client/src/pages/library/LibraryPage.tsx',
  'client/src/pages/transport/TransportPage.tsx',
  'client/src/pages/inventory/InventoryPage.tsx'
];

files.forEach(file => {
  const fullPath = path.join(basePath, file);
  if (!fs.existsSync(fullPath)) {
    console.log('Missing:', fullPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');

  // Backgrounds
  content = content.replace(/bg-slate-950/g, 'bg-white');
  content = content.replace(/bg-slate-900\/50/g, 'bg-white');
  content = content.replace(/bg-slate-900\/30/g, 'bg-white');
  content = content.replace(/bg-slate-900/g, 'bg-white');
  content = content.replace(/backdrop-blur-xl/g, '');
  content = content.replace(/bg-slate-800\/50/g, 'bg-[#F7F7F7]');
  content = content.replace(/bg-slate-800\/30/g, 'bg-[#F7F7F7]');
  content = content.replace(/bg-slate-800\/20/g, 'bg-[#F7F7F7]');
  content = content.replace(/bg-slate-800\/80/g, 'bg-white'); // Added for some inputs

  // Specific Cards / Modals
  content = content.replace(/rounded-xl border border-slate-800\/60 bg-slate-900\/50 backdrop-blur-sm/g, 'rounded-2xl border border-[#EAEAEA] bg-white');
  
  // Modals overlay (replace correctly)
  content = content.replace(/bg-black\/60 backdrop-blur-sm/g, 'bg-black/40 backdrop-blur-sm');
  // Modal content box
  content = content.replace(/bg-slate-900 border border-slate-800\/60 shadow-2xl/g, 'bg-white border border-[#EAEAEA] shadow-2xl');
  content = content.replace(/bg-slate-900 border border-slate-800\/60/g, 'bg-white border border-[#EAEAEA] shadow-2xl');

  // Remove other backdrop-blur-sm if it isn't part of modal
  // We already replaced modal, for others, remove
  content = content.replace(/backdrop-blur-sm/g, (match, offset, str) => {
    // Check if it's in a string that has bg-black/40 (we just replaced it above)
    const context = str.substring(Math.max(0, offset - 20), offset);
    if (context.includes('bg-black/40')) return match;
    return '';
  });

  // Borders
  content = content.replace(/border-slate-800\/60/g, 'border-[#EAEAEA]');
  content = content.replace(/border-slate-800\/40/g, 'border-[#EAEAEA]');
  content = content.replace(/border-slate-700\/50/g, 'border-[#EAEAEA]');
  content = content.replace(/border-slate-700\/40/g, 'border-[#EAEAEA]');

  // Tables
  content = content.replace(/hover:bg-slate-800\/30/g, 'hover:bg-[#FAFAFA]');
  content = content.replace(/divide-slate-800\/40/g, 'divide-[#F0F0F0]');
  // Add bg-[#FAFAFA] to thead
  content = content.replace(/<thead([^>]*)>/g, '<thead$1 className="bg-[#FAFAFA]">');

  // Text
  content = content.replace(/text-slate-300/g, 'text-[#333333]');
  content = content.replace(/text-slate-400/g, 'text-[#666666]');
  content = content.replace(/text-slate-500/g, 'text-[#8A8A8A]');
  content = content.replace(/text-slate-600/g, 'text-[#999999]');
  
  // Buttons & Accents
  content = content.replace(/bg-indigo-500\/10/g, 'bg-[#F7F7F7]');
  content = content.replace(/bg-indigo-500\/20/g, 'bg-[#F7F7F7]');
  content = content.replace(/bg-violet-500\/10/g, 'bg-[#F7F7F7]');
  content = content.replace(/text-indigo-400/g, 'text-[#111111]');
  content = content.replace(/text-indigo-300/g, 'text-[#111111]');
  content = content.replace(/text-violet-400/g, 'text-[#111111]');
  content = content.replace(/text-violet-300/g, 'text-[#111111]');

  content = content.replace(/bg-gradient-to-r from-indigo-500 to-violet-600/g, 'bg-[#111111]');
  content = content.replace(/bg-gradient-to-t from-indigo-600 to-violet-500/g, 'bg-[#111111]');
  content = content.replace(/hover:from-indigo-600 hover:to-violet-700/g, 'hover:bg-[#1A1A1A]');
  content = content.replace(/hover:shadow-lg hover:shadow-indigo-500\/20/g, 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]');

  // Status Badges
  content = content.replace(/text-emerald-400/g, 'text-emerald-600');
  content = content.replace(/bg-emerald-500\/10/g, 'bg-emerald-50');
  content = content.replace(/border-emerald-500\/20/g, 'border-emerald-200');

  content = content.replace(/text-rose-400/g, 'text-red-600');
  content = content.replace(/bg-rose-500\/10/g, 'bg-red-50');
  content = content.replace(/border-rose-500\/20/g, 'border-red-200');

  content = content.replace(/text-amber-400/g, 'text-amber-600');
  content = content.replace(/bg-amber-500\/10/g, 'bg-amber-50');
  content = content.replace(/border-amber-500\/20/g, 'border-amber-200');

  content = content.replace(/text-blue-400/g, 'text-blue-600');
  content = content.replace(/bg-blue-500\/10/g, 'bg-blue-50');
  content = content.replace(/border-blue-500\/20/g, 'border-blue-200');

  // Icons / miscellaneous colors
  content = content.replace(/text-slate-800/g, 'text-[#EAEAEA]');
  
  // Animation
  content = content.replace(/animate-in fade-in duration-500/g, 'animate-in fade-in duration-300');
  content = content.replace(/animate-pulse/g, ''); 

  // Inputs Focus
  content = content.replace(/focus:ring-indigo-500\/30/g, 'focus:ring-[#111111]/10 focus:border-[#DCDCDC]');
  content = content.replace(/placeholder:text-slate-[56]00/g, 'placeholder:text-[#8A8A8A]');
  content = content.replace(/hover:border-indigo-500\/20/g, 'hover:border-[#DCDCDC] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]');

  // Timetable
  if (file.includes('TimetablePage')) {
    content = content.replace(/bg-[a-z]+-500\/15/g, 'bg-[#111111]');
    content = content.replace(/text-[a-z]+-300/g, 'text-white');
    content = content.replace(/border-[a-z]+-500\/30/g, 'border-[#111111]');
    
    // inactive
    content = content.replace(/bg-slate-500\/15/g, 'bg-[#F7F7F7]');
  }

  // Attendance
  if (file.includes('AttendancePage')) {
    content = content.replace(/bg-emerald-500\/\[0\.02\]/g, 'bg-emerald-50');
    content = content.replace(/bg-rose-500\/\[0\.03\]/g, 'bg-red-50');
    // Active colors for attendance buttons
    content = content.replace(/bg-emerald-500\/20 text-emerald-400 border-emerald-500\/30 shadow-emerald-500\/10/g, 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm');
    content = content.replace(/bg-rose-500\/20 text-rose-400 border-rose-500\/30 shadow-rose-500\/10/g, 'bg-red-100 text-red-700 border-red-200 shadow-sm');
    content = content.replace(/bg-amber-500\/20 text-amber-400 border-amber-500\/30 shadow-amber-500\/10/g, 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm');
    content = content.replace(/bg-cyan-500\/20 text-cyan-400 border-cyan-500\/30 shadow-cyan-500\/10/g, 'bg-cyan-100 text-cyan-700 border-cyan-200 shadow-sm');
  }

  // Finally text-white to text-[#111111] with exclusions
  content = content.replace(/text-white/g, 'TEXT_WHITE_PLACEHOLDER');
  
  // Exclude buttons / badges / avatars
  // A simple heuristic for text-white in buttons: bg-[#111111] usually pairs with white text.
  content = content.replace(/bg-\[#111111\]([a-zA-Z0-9\-\s]*)TEXT_WHITE_PLACEHOLDER/g, 'bg-[#111111]$1text-white');
  // Gradient text-white (we removed gradients, but left bg-[#111111] up top)
  content = content.replace(/bg-emerald-500([a-zA-Z0-9\-\s]*)TEXT_WHITE_PLACEHOLDER/g, 'bg-emerald-500$1text-white');
  content = content.replace(/bg-red-500([a-zA-Z0-9\-\s]*)TEXT_WHITE_PLACEHOLDER/g, 'bg-red-500$1text-white');
  content = content.replace(/bg-amber-500([a-zA-Z0-9\-\s]*)TEXT_WHITE_PLACEHOLDER/g, 'bg-amber-500$1text-white');
  
  // Revert the rest to text-[#111111]
  content = content.replace(/TEXT_WHITE_PLACEHOLDER/g, 'text-[#111111]');

  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log('Transformation complete.');
