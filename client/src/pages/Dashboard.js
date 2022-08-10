import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar.js";
import { Row, Table, Container } from "react-bootstrap";
import { colRef } from "../firebase";
import { onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  const savedstories = [];

  const q = query(colRef, where("uid", "==", `${currentUser.uid}`));

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        savedstories.push(Object.entries({ ...doc.data(), id: doc.id }));
      });
    });
  });

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
            <tbody>
              {console.log(savedstories)}
              {savedstories.map((story, index) => (
                <tr key={story.id}>
                  <td>{index}</td>
                  <td>{story.title} test</td>
                  <td>{story.author}</td>
                  <td>{story.dateCreated}</td>
                  <td>{story.id}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    </>
  );
}
