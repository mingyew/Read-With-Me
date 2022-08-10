import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar.js";
import { Row, Table, Container } from "react-bootstrap";
import { colRef } from "../firebase";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();

  const [savedstories, setSavedstories] = useState(null);
  const [loading, setLoading] = useState(false);

  const q = query(colRef, where("uid", "==", `${currentUser.uid}`));

  async function getSavedstories() {
    setLoading(true);
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });
    setSavedstories(items);
    setLoading(false);
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
            <tbody>
              {savedstories &&
                savedstories.map((value, index) => {
                  <tr key={value.dateCreated}>
                    <td>{index}</td>
                    <td>{value.title}</td>
                    <td>{value.author}</td>
                    <td>{value.id}</td>
                  </tr>;
                })}
            </tbody>
          </Table>
        </Row>
        {savedstories && savedstories[1].title}
      </Container>
    </>
  );
}
