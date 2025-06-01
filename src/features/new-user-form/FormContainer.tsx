import type { Stage } from './contexts/stage';

import { useStage } from './contexts/stage';
import { OptionalFieldsForm } from './OptionalFieldsForm';
import { RequiredFieldsForm } from './RequiredFieldsForm';

const Component: Record<Stage, React.ReactNode> = {
  required: <RequiredFieldsForm />,
  optional: <OptionalFieldsForm />
};

export function FormContainer() {
  const { stage } = useStage();
  return Component[stage];
}
