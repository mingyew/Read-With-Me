import React, { useState, useEffect } from "react";
import TopNavBar from "../components/TopNavBar.js";
import Listenbar from "../components/Listenbar.js";
import HighlightPop from "../components/HighlightPop.js";
import Comments from "../components/Comments";
import { useParams } from "react-router";
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
      <Alert variant="danger">No such document!</Alert>;
    }
    setLoading(false);
  };

  useEffect(() => {
    getSavedstory().catch((err) => {
      if (!loading) return;
      <Alert variant="danger">Failed to fetch data! {err}</Alert>;
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
      <TopNavBar />
      <Listenbar audioURL={savedstory && savedstory.audioURL} />
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <Container>
          <HighlightPop lang={savedstory && savedstory.lang}>
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
          </HighlightPop>
          <Comments uid={uid} linkid={linkid} />
        </Container>
      )}
    </>
  );
}

export default SavedStoryPage;
