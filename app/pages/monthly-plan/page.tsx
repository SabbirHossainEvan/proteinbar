import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

const monthlyPlanSteps = [
  "Choose plan type",
  "Select meals and snacks",
  "Pick delivery days",
  "Confirm address",
  "Proceed to checkout",
];

export default function MonthlyPlanPage() {
  return (
    <Section
      title="Monthly Plan"
      subtitle="This page is prepared for monthly subscription logic and future Redux Toolkit API integration."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Flow Overview</h2>
          <ol className="mt-3 space-y-2 text-sm text-zinc-700">
            {monthlyPlanSteps.map((step, index) => (
              <li key={step}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-zinc-600">
            Next step: connect this flow with Redux Toolkit slices, async thunks,
            and backend APIs.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Integration Ready</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            <li>Plan state</li>
            <li>Pricing state</li>
            <li>Delivery state</li>
            <li>Checkout state</li>
          </ul>
          <div className="mt-4">
            <Button variant="outline">Start Implementation</Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}
