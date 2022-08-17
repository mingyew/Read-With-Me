import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar.js";
import { Row, Table, Container, Alert } from "react-bootstrap";
import { storiesRef } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const currentLocation = window.location.href;

  const [savedstories, setSavedstories] = useState(null);
  const [loading, setLoading] = useState(false);

  const q = query(storiesRef, where("uid", "==", `${currentUser.uid}`));

  const getSavedstories = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });
    setSavedstories(items);
    setLoading(false);
  };

  useEffect(() => {
    getSavedstories().catch((err) => {
      if (!loading) return;
      Alert("failed to fetch data", err);
    });

    return () => {
      setLoading(false);
    };
  }, []);

  const deleteStory = async (id) => {
    if (window.confirm("Are you sure you want to delete saved story?")) {
      await deleteDoc(doc(storiesRef, id)).then(() => {
        window.location.reload();
      });
    }
  };

  const renderTable = () => {
    if (savedstories != undefined || savedstories != null)
      return savedstories.map((value, index) => {
        return (
          <tr key={value.dateCreated}>
            <td>{index + 1}</td>
            <td>{value.title}</td>
            <td>{value.author}</td>
            <td>{value.dateCreated}</td>
            <td>
              <Link to={`/${value.uid}/${value.id}`}>
                {currentLocation}
                {value.uid}/{value.id}
              </Link>
            </td>
            <td
              style={{
                textAlign: "center",
              }}
            >
              <img
                src="/images/trashbin.png"
                onClick={deleteStory(value.id)}
                style={{
                  height: 23,
                }}
              ></img>
            </td>
          </tr>
        );
      });
  };

  return (
    <>
      <Topbar />
      <Container>
        <Row className="justify-content-md-center mt-4">
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date Created</th>
                  <th>Link</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>{renderTable()}</tbody>
            </Table>
          )}
        </Row>
      </Container>
    </>
  );
}
