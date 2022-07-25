import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const DropdownTranslate = () => {
  return (
    <DropdownButton id="dropdown-item-button" title="Translate">
      <Dropdown.Item as="button">Chinese</Dropdown.Item>
      <Dropdown.Item as="button">Russian</Dropdown.Item>
    </DropdownButton>
  );
};

export default DropdownTranslate;
