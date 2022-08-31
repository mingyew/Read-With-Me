import React from "react";
import TopNavBar from "../components/TopNavBar.js";
import Story from "../components/Story.js";
import Storylist from "../components/Storylist.json";
import { useAuth } from "../contexts/AuthContext";
import { Container, Row } from "react-bootstrap";

const Stories = () => {
  const { currentUser } = useAuth();
  const stories = Object.values(Storylist);
  const readingRate = 110; //would be change if age range changes

  const countWordsInArray = (body) => {
    var number = 0;

    body.map(
      (line) => (number += line.split(" ").filter((word) => word !== "").length)
    );

    return number;
  };

  return (
    <>
      <TopNavBar />
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
              id={story.id}
              uid={currentUser.uid}
              image={story.image}
              title={story.title}
              author={story.author}
              time={Math.round(countWordsInArray(story.body) / readingRate)}
            />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Stories;
