import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Translatebar from "../components/Translatebar.js";
import Topbar from "../components/Topbar.js";
import Storylist from "../stories/Storylist";
import { useParams } from "react-router";

import { Container, Row, Col } from "react-bootstrap";

function Story() {
  const { id } = useParams();
  const stories = Object.values(Storylist);

  var foundStory = stories.find(function (story) {
    return story.id == id;
  });

  const [title, setTitle] = useState(foundStory.title);
  const [author, setAuthor] = useState(foundStory.author);
  const [body, setBody] = useState(foundStory.body);

  const [translatedStory, setTranslatedStory] = useState("");

  const translateStory = (targetedLang) => {
    fetch("http://localhost:3001/api/translate-text", {
      method: "POST",
      body: JSON.stringify({ text: foundStory, language: targetedLang }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setTranslatedStory(data.translated));
  };

  useEffect(() => {
    if (translatedStory != "") {
      setTitle(translatedStory.title[0]);
      setAuthor(translatedStory.author[0]);
      setBody(translatedStory.body[0]);
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
      </Container>
    </>
  );
}

export default Story;
