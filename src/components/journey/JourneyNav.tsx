import { Check, ArrowRight } from 'lucide-react';

export type JourneyStage = 'claim' | 'unwrap' | 'bridge' | 'stake';

interface Stage {
  key: JourneyStage;
  label: string;
  href: string;
  /** Short description of the action, used in the "Next step" card. */
  next: string;
}

const STAGES: Stage[] = [
  { key: 'claim', label: 'Claim', href: '/claim', next: 'Claim your tokens on Hedgey' },
  { key: 'unwrap', label: 'Unwrap', href: '/wrap', next: 'Unwrap your WAI3 to native AI3' },
  { key: 'bridge', label: 'Bridge', href: '/xdm', next: 'Bridge your AI3 to the consensus chain with XDM' },
  { key: 'stake', label: 'Stake', href: '/stake', next: 'Stake your AI3 to start earning rewards' },
];

const STEPPER_CAPTIONS: Record<JourneyStage, string> = {
  claim: 'If you would like to stake your claimed tokens, this is the first step on the journey',
  unwrap: "If you would like to stake, here's the path you're following",
  bridge: "If you would like to stake, here's the path you're following",
  stake: "If you would like to stake, here's the path you're following",
};

/**
 * Horizontal progress stepper shown at the top of each guide in the
 * "claim to staked" journey. Completed stages show a check, the current
 * stage is highlighted, and every stage links to its guide.
 */
export function JourneyNav({ current }: { current: JourneyStage }) {
  const currentIndex = STAGES.findIndex((s) => s.key === current);

  return (
    <nav aria-label="Your token journey" className="bg-white rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-600 mb-3 text-center">
        {STEPPER_CAPTIONS[current]}
      </p>
      <ol className="flex items-center">
        {STAGES.map((stage, i) => {
          const status = i < currentIndex ? 'complete' : i === currentIndex ? 'current' : 'upcoming';
          const circle =
            status === 'complete'
              ? 'bg-blue-600 text-white'
              : status === 'current'
                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                : 'bg-gray-100 text-gray-400 border border-gray-300';
          const label =
            status === 'upcoming' ? 'text-gray-400' : 'text-gray-900 font-medium';

          return (
            <li key={stage.key} className={`flex items-center ${i < STAGES.length - 1 ? 'flex-1' : ''}`}>
              <a
                href={stage.href}
                aria-current={status === 'current' ? 'step' : undefined}
                className="flex items-center gap-2 flex-shrink-0 rounded-md hover:opacity-80 transition-opacity"
              >
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${circle}`}>
                  {status === 'complete' ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span className={`text-sm ${label}`}>{stage.label}</span>
              </a>
              {i < STAGES.length - 1 && (
                <span className={`flex-1 h-px mx-2 sm:mx-3 ${i < currentIndex ? 'bg-blue-300' : 'bg-gray-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * "Next step" call-to-action shown at the foot of each guide to keep the
 * journey moving. On the final stage it shows a completion message instead.
 */
export function JourneyNextStep({ current }: { current: JourneyStage }) {
  const currentIndex = STAGES.findIndex((s) => s.key === current);
  const next = STAGES[currentIndex + 1];

  if (!next) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-900 font-medium">
          That's the staking path covered - your AI3 is staked and earning rewards.
        </p>
        <p className="text-green-800 text-sm mt-1">
          You can track and manage your position any time on the staking portal.
        </p>
      </div>
    );
  }

  // On the claim page, frame staking as an option rather than an expected next action.
  if (current === 'claim') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-700">Optional</p>
          <p className="text-blue-900 font-semibold">Thinking about staking?</p>
          <p className="text-blue-800 text-sm mt-1">
            Staking is open to all token holders, but it is not required. If you would like to stake, the
            first step is to unwrap your WAI3 to native AI3.
          </p>
        </div>
        <a
          href="/wrap"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          Show me how
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-blue-700">Next step</p>
        <p className="text-blue-900 font-semibold">{next.next}</p>
      </div>
      <a
        href={next.href}
        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
