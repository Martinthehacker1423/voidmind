import { useState } from 'react';
import { Step0_Welcome } from './steps/Step0_Welcome.jsx';
import { Step1_ApiKey } from './steps/Step1_ApiKey.jsx';
import { Step2_Personality } from './steps/Step2_Personality.jsx';
import { Step3_Ready } from './steps/Step3_Ready.jsx';
import { useSettingsStore } from '../../store/settingsStore.js';

const TOTAL_STEPS = 4;

export function SetupWizard() {
  const [step, setStep] = useState(0);
  const updateSettings = useSettingsStore(s => s.updateSettings);

  const progress = (step / (TOTAL_STEPS - 1)) * 100;

  async function finish() {
    await updateSettings({ setupCompleted: true });
  }

  function renderStep() {
    switch (step) {
      case 0: return <Step0_Welcome onNext={() => setStep(1)} onSkip={finish} />;
      case 1: return <Step1_ApiKey  onNext={() => setStep(2)} />;
      case 2: return <Step2_Personality onNext={() => setStep(3)} onSkip={() => setStep(3)} />;
      case 3: return <Step3_Ready onStart={finish} />;
      default: return null;
    }
  }

  return (
    <div className="wizard-root">
      <div className="wizard-progress" style={{ width: `${progress}%` }} />
      <div className="wizard-glow" />
      <div className="wizard-glow-bl" />
      <div className="wizard-card">
        {renderStep()}
      </div>
    </div>
  );
}
