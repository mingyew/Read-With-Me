import { Col, Badge } from "react-bootstrap";
import React from "react";

// Story COMPONENT
const Story = ({ image, title, author, time }) => {
  return (
    <Col className="mr-lg-5">
      <img
        src={image}
        className="img-fluid"
        style={{
          minWidth: 350,
          maxWidth: 350,
          minHeight: 300,
          maxHeight: 300,
        }}
      />
      <div className="mt-3">
        <h5 className="fw-bold">{title}</h5>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <h5 className="fw-light">
            <small>{author}</small>
          </h5>
        </div>
        <div className="">
          <Badge pill bg="primary">
            {time}
          </Badge>
        </div>
      </div>
    </Col>
  );
};

export default Story;
