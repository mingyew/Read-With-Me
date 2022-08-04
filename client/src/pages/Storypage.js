import React, { useState, useEffect } from "react";
import Translatebar from "../components/Translatebar.js";
import Topbar from "../components/Topbar.js";
import Storylist from "../stories/Storylist";
import { useParams } from "react-router";
import Comments from "../components/Comments";

import { Container, Row, Col } from "react-bootstrap";

function StoryPage() {
  const { id } = useParams();
  const stories = Object.values(Storylist);

  // The story from the database
  var foundStory = stories.find(function (story) {
    return story.id === id;
  });

  // Declare state variables, internal to this page. Default to un-translated story
  const [title, setTitle] = useState(foundStory.title);
  const [author, setAuthor] = useState(foundStory.author);
  const [body, setBody] = useState(foundStory.body);

  const [translatedStory, setTranslatedStory] = useState(null);

  const translateStory = (targetedLang) => {
    console.log("translateStory() called with targetedLang=" + targetedLang);
    fetch("http://localhost:3001/api/translate-text", {
      method: "POST",
      body: JSON.stringify({ text: foundStory, language: targetedLang }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.translated) {
          setTranslatedStory(data.translated);
        } else {
          // do something with the error
          setTranslatedStory({ title: "ERROR", author: "ERROR", body: [] });
        }
      });
  };

  useEffect(() => {
    if (translatedStory) {
      setTitle(translatedStory.title);
      setAuthor(translatedStory.author);
      setBody(translatedStory.body);
    }
  }, [translatedStory, setTranslatedStory]);

  return (
    <>
      <Topbar />
      <Translatebar translateStory={translateStory} />
      <Container>
        <Row className="justify-content-md-center mt-4">
          <Col className="col-lg-6">
            <h2
              style={{
                fontWeight: "700",
              }}
            >
              {title}
            </h2>
            {body.map((paragraph, i) => (
              <div key={i}>
                {paragraph}
                <br />
              </div>
            ))}
          </Col>
        </Row>
        <Row className="justify-content-md-end mt-1" style={{ color: "grey" }}>
          Referenced from {author}
        </Row>
        <Comments
          commentsUrl="http://localhost:3000/comments"
          currentUserId="1"
        />
      </Container>
    </>
  );
}

export default StoryPage;
