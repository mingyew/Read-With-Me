import { Link } from "react-router-dom";
import { Col, Badge } from "react-bootstrap";
import React from "react";

// Story COMPONENT
const Story = ({ id, image, title, author, time, uid }) => {
  const minOrMins = (time) => {
    if (time > 1) {
      return "mins";
    } else {
      return "min";
    }
  };

  return (
    <Col className="mr-lg-5">
      <Link to={`/story/${id}/${uid}`}>
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
      </Link>
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
            {time} {minOrMins(time)}
          </Badge>
        </div>
      </div>
    </Col>
  );
};

export default Story;
