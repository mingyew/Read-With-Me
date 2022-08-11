import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar.js";
import { Row, Table, Container, Alert } from "react-bootstrap";
import { colRef } from "../firebase";
import { getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const currentLocation = window.location.href;

  const [savedstories, setSavedstories] = useState(null);
  const [loading, setLoading] = useState(false);

  const q = query(colRef, where("uid", "==", `${currentUser.uid}`));

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
              <Link to={`/saved/${value.id}`}>
                {currentLocation}saved/
                {value.id}
              </Link>
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
