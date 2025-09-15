import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import BillingPage from "./BillingPage";
import HistoryPage from "./HistoryPage";
import './App.css';

function App() {
    return (
        <Router>
            {/* Dark Navbar */}
            <Navbar bg="dark" variant="dark" expand="sm">
                <Container>
                    <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
                        <img
                            src="/Madhuli.png"
                            alt="Madhuli Logo"
                            style={{
                                height: "40px",
                                width: "auto",
                                objectFit: "contain"
                            }}
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={NavLink} to="/" end>
                                Billing
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/history">
                                History
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main Content */}
            <Container fluid className="bg-dark text-light min-vh-100 p-1">
                <Routes>
                    <Route path="/" element={<BillingPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;