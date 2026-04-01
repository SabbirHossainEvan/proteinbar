const fs = require('fs');
const file = 'd:/Evan_APP/proteinbar/components/monthly-plan/MakeYourPlanModal.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. Remove state planName
txt = txt.replace(/  const \[planName, setPlanName\] = useState\(""\);\r?\n/, '');

// 2. Change canSave logic
const oldCanSave = /  const canSave = categories\.every\(\(category\) =>\r?\n    category\.options\.some\(\(option\) => \(selectedCounts\[option\.id\] \?\? 0\) > 0\),\r?\n  \);/;
const newCanSave = '  const canSave = Object.values(selectedCounts).some((count) => count > 0);';
txt = txt.replace(oldCanSave, newCanSave);

// 3. Remove setPlanName calls
txt = txt.replace(/        setPlanName\(""\);\r?\n/, '');
txt = txt.replace(/    setPlanName\(""\);\r?\n/, '');

// 4. Update title in payload
txt = txt.replace(/      title: planName\.trim\(\) \|\| "Make Your Own Plan",/, '      title: "Make Your Own Plan",');

// 5. Remove Plan Name UI section
const uiRegex = /              <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">\r?\n                <label className="text-sm font-semibold uppercase tracking-wide text-zinc-700">\r?\n                  Plan Name\r?\n                <\/label>\r?\n                <input\r?\n                  type="text"\r?\n                  value=\{planName\}\r?\n                  onChange=\{\(event\) => setPlanName\(event\.target\.value\)\}\r?\n                  placeholder="Enter your plan name"\r?\n                  className="mt-3 h-12 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"\r?\n                \/>\r?\n              <\/section>\r?\n\r?\n/;
txt = txt.replace(uiRegex, '');

fs.writeFileSync(file, txt, 'utf8');
console.log('Removed Plan Name and updated canSave');
