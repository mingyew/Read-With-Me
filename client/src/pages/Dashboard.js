import React from "react";
import Topbar from "../components/Topbar.js";
import { Row, Table, Container } from "react-bootstrap";

export default function Dashboard() {
  return (
    <>
      <Topbar />
      <Container>
        <Row className="justify-content-md-center mt-4">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Story</th>
                <th>Date Created</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </Row>
      </Container>
    </>
  );
}
