const fs = require('fs');
const file = 'd:/Evan_APP/proteinbar/components/monthly-plan/MakeYourPlanModal.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. Replace the entire old helper functions and CategorySection with the new simpler CategorySection
const blockToRemoveStart = 'function getOptionGroups(options: BuilderOption[]) {';
const blockToRemoveEnd = 'function MealSummaryPanel(';

const startIdx = txt.indexOf(blockToRemoveStart);
const endIdx = txt.indexOf(blockToRemoveEnd);

if (startIdx !== -1 && endIdx !== -1) {
  const newCategorySection = `function CategorySection({
  category,
  selectedValue,
  onChange,
}: {
  category: CategoryConfig;
  selectedValue: string;
  onChange: (optionId: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
          {category.label}
        </label>
        <select
          value={selectedValue}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
        >
          <option value="">Choose {category.label.includes("-") ? category.label.split(" - ")[1] : category.label}</option>
          {category.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label} - {option.price.toFixed(2)} MAD
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

function getCategorySummary(
  category: CategoryConfig,
  selectedCounts: Record<string, number>,
) {
  const selectedOption = category.options.find(opt => selectedCounts[opt.id] > 0);
  return selectedOption ? selectedOption.label : "";
}

`;

  txt = txt.slice(0, startIdx) + newCategorySection + txt.slice(endIdx);
}

// 2. Replace state variables in MakeYourPlanModal
const stateRegex = /  const \[selections, setSelections\] =[\s\S]*?useState<Record<string, number>>\(\{\}\);/;
const newState = `  const [categorySelections, setCategorySelections] = useState<Record<string, string>>({});

  const selectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(categorySelections).forEach((optionId) => {
      if (optionId) counts[optionId] = 1;
    });
    return counts;
  }, [categorySelections]);`;
txt = txt.replace(stateRegex, newState);

// 3. Replace clear logic in handleEscape
const escapeRegex = /        setSelections\(initialSelections\);\r?\n        setSelectedCounts\(\{\}\);/;
txt = txt.replace(escapeRegex, '        setCategorySelections({});');

// 4. Replace clear logic in handleModalClose
const closeRegex = /    setSelections\(initialSelections\);\r?\n    setSelectedCounts\(\{\}\);/;
txt = txt.replace(closeRegex, '    setCategorySelections({});');

// 5. Replace JSX map in MakeYourPlanModal
const mapRegex = /              \{categories\.map\(\(category\) => \([\s\S]*?\}\r?\n                \/>\r?\n              \)\)\}/;
const newMap = `              {categories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  selectedValue={categorySelections[category.id] ?? ""}
                  onChange={(optionId) =>
                    setCategorySelections((prev) => ({
                      ...prev,
                      [category.id]: optionId,
                    }))
                  }
                />
              ))}`;
txt = txt.replace(mapRegex, newMap);

fs.writeFileSync(file, txt, 'utf8');
console.log('Refactored custom plan UI logic updated');
