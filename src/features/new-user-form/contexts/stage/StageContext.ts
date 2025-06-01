import { createContext } from 'react';

export type Stage = 'optional' | 'required';

interface StageContextProps {
  stage: Stage;
  setStage: (stage: Stage) => void;
}

export const StageContext = createContext<StageContextProps>({
  stage: 'required',
  setStage: () => {}
});
