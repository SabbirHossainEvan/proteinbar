const fs = require('fs');
const file = 'd:/Evan_APP/proteinbar/components/monthly-plan/MonthlyPlanStepTwoForm.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. Remove useMemo
txt = txt.replace(/  const planTypeOptions = useMemo\([\s\S]*?\[isCustomPlan, rules\],\r?\n  \);\r?\n/, '');

// 2. Remove useEffect
txt = txt.replace(/  useEffect\(\(\) => \{\r?\n    if \(!requiresPlanType\) \{\r?\n      setPlanType\(""\);\r?\n      return;\r?\n    \}\r?\n    if \(planType && !planTypeOptions\.includes\(planType\)\) \{\r?\n      setPlanType\(""\);\r?\n    \}\r?\n  \}, \[planType, planTypeOptions, requiresPlanType\]\);\r?\n\r?\n/, '');

// 3. Remove UI blocks
// It looks like:
//             {isCustomPlan ? (
//               <div>
//                 ...
//               </div>
//             ) : null}
const uiRegex = /[ \t]*\{isCustomPlan \? \([\s\S]*?\([\s\S]*?\) : null\}\r?\n[ \t]*<\/div>\r?\n[ \t]*\) : null\}\r?\n\r?\n/;
txt = txt.replace(uiRegex, '');

fs.writeFileSync(file, txt, 'utf8');
console.log('Fix script done');
