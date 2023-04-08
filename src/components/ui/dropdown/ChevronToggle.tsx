import { ForwardRefRenderFunction, MouseEvent, forwardRef } from 'react';
import { Button } from 'react-bootstrap';
import { BsChevronDown } from 'react-icons/bs';

interface Props {
  children: JSX.Element;
  onClick: (ev: MouseEvent) => void;
}

const ChevronToggle: ForwardRefRenderFunction<HTMLButtonElement, Props> = ({ children, onClick }, ref) => (
  <Button
    ref={ref}
    variant="primary"
    onClick={(ev) => {
      ev.preventDefault();
      onClick(ev);
    }}
  >
    {children} <BsChevronDown />
  </Button>
);

export default forwardRef(ChevronToggle);
