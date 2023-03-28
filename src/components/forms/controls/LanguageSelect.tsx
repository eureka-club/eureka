import { FunctionComponent } from 'react';
import FormControl from 'react-bootstrap/FormControl';

type Props = {
  defaultValue?: string;
};
const LanguageSelect: FunctionComponent<Props> = ({ defaultValue }) => {
  return (
    <FormControl type="text" as="select"  defaultValue={defaultValue}>
      <option value="">select...</option>
      <option value="spanish">Spanish</option>
      <option value="english">English</option>
      <option value="hindi">Hindi</option>
      <option value="portuguese">Portuguese</option>
      <option value="bengali">Bengali</option>
      <option value="russian">Russian</option>
      <option value="japanese">Japanese</option>
      <option value="german">German</option>
      <option value="french">French</option>
    </FormControl>
  );
};

export default LanguageSelect;
