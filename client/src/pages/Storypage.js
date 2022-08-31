import React, { useState, useEffect, useRef } from "react";
import Translatebar from "../components/Translatebar.js";
import TopNavBar from "../components/TopNavBar.js";
import Storylist from "../components/Storylist.json";
import Editable from "../components/Editable.js";
import { useParams } from "react-router";

import { Container, Row, Col, Alert } from "react-bootstrap";

function StoryPage() {
  const { id, uid } = useParams();
  const stories = Object.values(Storylist);

  // The story from the database
  var foundStory = stories.find(function (story) {
    return story.id === id;
  });

  const Diff = require("diff");
  const [translatedStory, setTranslatedStory] = useState(foundStory);

  // Declare state variables, internal to this page. Default to un-translated story
  const inputRef = useRef();
  const [title, setTitle] = useState(foundStory.title);
  const [author, setAuthor] = useState(foundStory.author);
  const [body, setBody] = useState(foundStory.body);

  const translateStory = (targetedLang) => {
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
          if (translatStoryback() == false || translatStoryback() == null) {
            <Alert variant="danger">
              Tanslation poor! Please edit by clicking on text area.
            </Alert>;
          }
        } else {
          <Alert variant="danger">Error Translating</Alert>;
        }
      });
  };

  const translatStoryback = () => {
    fetch("http://localhost:3001/api/translate-text", {
      method: "POST",
      body: JSON.stringify({ text: translatedStory, language: "en" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.translated) {
          const diff = Diff.diffChars(
            data.translated.body.toString(),
            foundStory.body.toString()
          );
          var count = 0;
          diff.forEach((part) => {
            if (part.added) count = count + part.count;
            if (part.removed) count = count + part.count;
          });
          if (diff / translatedStory.body.toString().length < 0.5) return true;
          return false;
        } else {
          <Alert variant="danger">
            Error calculating translation efficency.
          </Alert>;
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
      <TopNavBar />
      <Translatebar
        translateStory={translateStory}
        translatStoryback={translatStoryback}
        id={id}
        uid={uid}
        body={body}
        translatedStory={translatedStory}
      />
      <Container>
        <Row className="justify-content-md-center mt-4">
          <Col className="col-lg-6">
            <h2
              style={{
                fontWeight: "700",
              }}
            >
              <Editable
                text={title}
                placeholder="Title"
                childRef={inputRef}
                type="input"
              >
                <input
                  ref={inputRef}
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Editable>
            </h2>

            <Editable
              text={body.map((paragraph, i) => (
                <div key={i}>
                  {paragraph}
                  <br />
                </div>
              ))}
              type="textarea"
              placeholder="Body"
              childRef={inputRef}
            >
              <textarea
                ref={inputRef}
                name="body"
                rows="25"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{ width: 550 }}
              />
            </Editable>
          </Col>
        </Row>
        <Row className="mt-1" style={{ color: "grey" }}>
          <div className="d-flex justify-content-end">
            <Editable
              text={author}
              placeholder="Author"
              type="input"
              childRef={inputRef}
            >
              <input
                ref={inputRef}
                type="text"
                name="title"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Editable>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default StoryPage;
