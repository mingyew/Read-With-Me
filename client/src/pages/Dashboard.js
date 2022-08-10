import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar.js";
import { Row, Table, Container } from "react-bootstrap";
import { colRef } from "../firebase";
import { onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  const [savedstories, setSavedstories] = useState([]);

  const q = query(colRef, where("uid", "==", `${currentUser.uid}`));

  function getSavedstories() {
    const items = [];
    onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
    });
    setSavedstories(items);
  }

  useEffect(() => {
    getSavedstories();
  }, []);

  return (
    <>
      <Topbar />
      <Container>
        <Row className="justify-content-md-center mt-4">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Date Created</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </Row>
        {console.log(savedstories)}
        {console.log(savedstories[0])}
      </Container>
    </>
  );
}
