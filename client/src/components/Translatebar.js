import React from "react";
import DropdownTranslate from "./Dropdownbutton";

import { Button } from "react-bootstrap";

const Translatebar = (props) => {
  return (
    <div
      className="px-3 py-2 border-bottom mb-3"
      style={{
        backgroundColor: "#D3D3D3",
      }}
    >
      <div className="container d-flex flex-wrap justify-content-md-end">
        <DropdownTranslate translateStory={props.translateStory} />
        <Button
          className="btn btn-light text-dark ms-2"
          //onClick={props.translateStory}
        >
          Record
        </Button>
      </div>
    </div>
  );
};

export default Translatebar;
