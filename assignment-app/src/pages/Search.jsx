import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";

function Search() {
  const [searchField, setSearchField] = useState("operatingSystem");
  const [keyword, setKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchExecuted, setSearchExecuted] = useState(false);

  const fetchData = async (field = "", keyword = "") => {
    setLoading(true);
    setError("");
    setSearchExecuted(true);

    try {
      let url = "/api/data/search";

      if (keyword.trim() !== "") {
        url += `?filterType=${encodeURIComponent(field)}&keyword=${encodeURIComponent(keyword.trim())}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setFilteredData(data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data.");
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData(searchField, keyword);
  };

  const getStats = (field) => {
    if (!searchExecuted || filteredData.length === 0) {
      return { avg: 0, median: 0 };
    }

    const values = filteredData
      .map((item) => Number(item[field]))
      .filter(Boolean)
      .sort((a, b) => a - b);

    if (values.length === 0) return { avg: 0, median: 0 };

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const mid = Math.floor(values.length / 2);
    const median =
      values.length % 2 !== 0
        ? values[mid]
        : (values[mid - 1] + values[mid]) / 2;

    return {
      avg: Math.round(avg * 10) / 10,
      median: Math.round(median * 10) / 10,
    };
  };

  const stats = {
    appUsage: getStats("App Usage Time (min/day)"),
    screenTime: getStats("Screen On Time (hours/day)"),
    numApps: getStats("Number of Apps Installed"),
    age: getStats("Age"),
  };

  return (
    <Container className="my-4">
      <Row className="align-items-end mb-2">
        <Col md={4}>
          <Form.Label className="my-4">Select data point to filter search by</Form.Label>
          <Form.Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="mb-3 form-select-sm w-75"
          >
            <option value="operatingSystem">operatingSystem</option>
            <option value="model">model</option>
            <option value="gender">gender</option>
            <option value="behaviorclass">behaviorSystem</option>
          </Form.Select>

          <Form.Control
           type="text"
          placeholder="Search by Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="mb-3 w-100"
          style={{ maxWidth: "90%" }}
          />

          <Button variant="light" className="w-100 text-black border" onClick={handleSearch}>
            Search
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {loading && (
            <p className="fw-semibold text-dark">
              <Spinner animation="border" size="sm" className="me-2" />
              Loading...
            </p>
          )}
          {!loading && searchExecuted && !error && (
            <p className="fw-semibold text-dark">
              {filteredData.length > 0
                ? `Displaying ${filteredData.length.toLocaleString("en-US")} Records`
                : "No Records To Display"}
            </p>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      <Row className="text-center mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title className="h6">App Usage Time (min/day)</Card.Title>
              <Card.Text className="mb-0">
                <small>
                  Average – {stats.appUsage.avg.toLocaleString("en-US")} Minutes<br />
                  Median – {stats.appUsage.median.toLocaleString("en-US")} Minutes
                </small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title className="h6">Screen On Time (hours/day)</Card.Title>
              <Card.Text className="mb-0">
                <small>
                  Average – {stats.screenTime.avg.toLocaleString("en-US")} Hours<br />
                  Median – {stats.screenTime.median.toLocaleString("en-US")} Hours
                </small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title className="h6">Number of Apps Installed</Card.Title>
              <Card.Text className="mb-0">
                <small>
                  Average – {stats.numApps.avg.toLocaleString("en-US")} Apps<br />
                  Median – {stats.numApps.median.toLocaleString("en-US")} Apps
                </small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title className="h6">Age</Card.Title>
              <Card.Text className="mb-0">
                <small>
                  Average – {stats.age.avg.toLocaleString("en-US")} Years<br />
                  Median – {stats.age.median.toLocaleString("en-US")} Years
                </small>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {!loading && searchExecuted && filteredData.length > 0 && (
        <Table striped bordered hover responsive className="text-start mt-3">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Device Model</th>
              <th>Operating System</th>
              <th>App Usage Time (min/day)</th>
              <th>Screen On Time (hours/day)</th>
              <th>Battery Drain (mAh/day)</th>
              <th>Number of Apps Installed</th>
              <th>Data Usage (MB/day)</th>
              <th>Age</th>
              <th>Gender</th>
              <th>User Behavior Class</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr key={index}>
                <td>{user["User ID"]}</td>
                <td>{user["Device Model"]}</td>
                <td>{user["Operating System"]}</td>
                <td>{Number(user["App Usage Time (min/day)"]).toLocaleString("en-US")}</td>
                <td>{Number(user["Screen On Time (hours/day)"]).toLocaleString("en-US")}</td>
                <td>{Number(user["Battery Drain (mAh/day)"]).toLocaleString("en-US")}</td>
                <td>{Number(user["Number of Apps Installed"]).toLocaleString("en-US")}</td>
                <td>{Number(user["Data Usage (MB/day)"]).toLocaleString("en-US")}</td>
                <td>{user["Age"]}</td>
                <td>{user["Gender"]}</td>
                <td>{user["User Behavior Class"]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Search;
