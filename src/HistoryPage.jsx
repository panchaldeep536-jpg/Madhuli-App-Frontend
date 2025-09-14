import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from "react-bootstrap";

const HistoryPage = () => {
    const [bills, setBills] = useState([]);
    const [todayEarning, setTodayEarning] = useState(0);
    const [totalEarning, setTotalEarning] = useState(0);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await axios.get("https://your-backend.onrender.com/api/bills");
            setBills(res.data);

            const today = new Date().toDateString();
            let todaySum = 0;
            let totalSum = 0;

            res.data.forEach(bill => {
                totalSum += bill.total;
                if (new Date(bill.createdAt).toDateString() === today) {
                    todaySum += bill.total;
                }
            });

            setTodayEarning(todaySum);
            setTotalEarning(totalSum);

        } catch (err) {
            console.error(err);
        }
    };

    const handleClearHistory = async () => {
        if (!window.confirm("Are you sure you want to clear all history?")) return;
        try {
            await axios.delete("https://your-backend.onrender.com/api/bills");
            fetchBills();
        } catch (err) {
            console.error(err);
            alert("Error clearing history");
        }
    };

    return (
        <div className="p-2">
            {/* Earnings Summary Cards */}
            <Row className="mb-3">
                <Col xs={12} sm={6} className="mb-2">
                    <Card className="p-3 text-center">
                        <h5>Today’s Earnings</h5>
                        <h3>₹{todayEarning}</h3>
                    </Card>
                </Col>
                <Col xs={12} sm={6} className="mb-2">
                    <Card className="p-3 text-center">
                        <h5>Total Earnings</h5>
                        <h3>₹{totalEarning}</h3>
                    </Card>
                </Col>
            </Row>

            {/* Clear History Button */}
            <Button variant="danger" className="mb-3 w-100" onClick={handleClearHistory}>
                Clear History
            </Button>

            {/* Bills */}
            <Row>
                {bills.map(bill => (
                    <Col xs={12} key={bill._id} className="mb-2">
                        <Card className="p-2">
                            <Card.Body>
                                <Card.Title className="fs-5">Total: ₹{bill.total}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {new Date(bill.createdAt).toLocaleString()}
                                </Card.Subtitle>
                                <ul className="mb-0">
                                    {bill.items.map((i, idx) => (
                                        <li key={idx} className="fs-6">
                                            {i.name} x {i.qty} = ₹{i.price * i.qty}
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HistoryPage;