import React from "react";
import Topbar from "../components/Topbar.js";
import Story from "../components/Story.js";
import Storylist from "../stories/Storylist";
import { Container, Row } from "react-bootstrap";

// Stories PAGE!
const Stories = () => {
  const stories = Object.values(Storylist);
  return (
    <>
      <Topbar />
      <Container>
        <h2
          className="mt-4 mb-5"
          style={{
            fontWeight: "350",
          }}
        >
          Popular stories
        </h2>
        <Row className="justify-content-md-center mt-4 pb-4 mb-5">
          {stories.map((story) => (
            <Story
              key={story.id}
              image={story.image}
              title={story.title}
              author={story.author}
              time={story.time}
            />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Stories;
