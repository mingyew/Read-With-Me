import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar.js";
import Listenbar from "../components/Listenbar.js";
import { useParams } from "react-router";
import Comments from "../components/Comments";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import { Container, Row, Col, Alert } from "react-bootstrap";

function SavedStoryPage() {
  const { uid, linkid } = useParams();

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
            {savedstory && savedstory.author}
          </Row>
          <Comments uid={uid} linkid={linkid} />
        </Container>
      )}
    </>
  );
}

export default SavedStoryPage;
