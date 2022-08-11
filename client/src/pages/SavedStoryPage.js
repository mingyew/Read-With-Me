import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar.js";
import Listenbar from "../components/Listenbar.js";
import { useParams } from "react-router";
import Comments from "../components/Comments";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import { Container, Row, Col, Alert } from "react-bootstrap";

function StoryPage() {
  const { linkid } = useParams();

  const [loading, setLoading] = useState(false);
  const [savedstory, setSavedstory] = useState(null);

  const docRef = doc(db, "savedstories", linkid);

  const getSavedstory = async () => {
    setLoading(true);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSavedstory(docSnap.data());
    } else {
      Alert("No such document!");
    }
    setLoading(false);
  };

  useEffect(() => {
    getSavedstory().catch((err) => {
      if (!loading) return;
      Alert("failed to fetch data", err);
    });
    return () => {
      setLoading(false);
    };
  }, []);

  const renderStory = () => {
    if (savedstory != undefined || savedstory != null)
      return savedstory.story.map((paragraph, i) => {
        return (
          <div key={i}>
            {paragraph}
            <br />
          </div>
        );
      });
  };

  const renderTitle = () => {
    if (savedstory != undefined || savedstory != null) return savedstory.title;
  };

  const renderAuthor = () => {
    if (savedstory != undefined || savedstory != null) return savedstory.author;
  };

  return (
    <>
      <Topbar />
      <Listenbar audioURL={savedstory && savedstory.audioURL} />
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <Container>
          <Row className="justify-content-md-center mt-4">
            <Col className="col-lg-6">
              <h2
                style={{
                  fontWeight: "700",
                }}
              >
                {savedstory && savedstory.title}
              </h2>
              {renderStory()}
            </Col>
          </Row>
          <Row
            className="justify-content-md-end mt-1"
            style={{ color: "grey" }}
          >
            Referenced from {savedstory && savedstory.author}
          </Row>
          <Comments
            commentsUrl="http://localhost:3010/comments"
            currentUserId="1"
          />
        </Container>
      )}
    </>
  );
}

export default StoryPage;
