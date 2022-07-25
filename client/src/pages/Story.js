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

  const title = foundStory.title;
  const author = foundStory.author;
  const paragraphs = foundStory.body;

  const [translatedText, setTranslatedText] = useState("");

  const translateText = () => {
    fetch("http://localhost:3001/api/translate-text", {
      method: "POST",
      body: "test",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setTranslatedText(data.translated));
  };

  return (
    <>
      <Topbar />
      <Translatebar translateText={translateText} />
      {console.log(translatedText)}
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
            {paragraphs.map((paragraph, i) => (
              <div key={i}>
                {paragraph.map((line, i) => (
                  <div key={i}>
                    {line}
                    <br />
                  </div>
                ))}
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
