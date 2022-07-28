import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const DropdownTranslate = (props) => {
  return (
    <DropdownButton id="dropdown-item-button" title="Translate">
      <Dropdown.Item as="button" onClick={() => props.translateStory("zh-CN")}>
        Chinese
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => props.translateStory("fil")}>
        Filipino
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => props.translateStory("ta")}>
        Tamil
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => props.translateStory("ru")}>
        Russian
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => props.translateStory("vi")}>
        Vietnamnese
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default DropdownTranslate;
