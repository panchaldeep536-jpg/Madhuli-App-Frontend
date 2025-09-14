import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Button, Form, Collapse, Spinner } from "react-bootstrap";

const BillingPage = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState({});
    const [total, setTotal] = useState(0);

    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://madhuli-backend.onrender.com/api/items");
            setItems(res.data);
        } catch (err) {
            console.error(err);
            alert("Error fetching items");
        } finally {
            setLoading(false);
        }
    };

    const addQty = (item) => {
        const newCart = { ...cart, [item._id]: (cart[item._id] || 0) + 1 };
        setCart(newCart);
        calcTotal(newCart);
    };

    const removeQty = (item) => {
        if (!cart[item._id]) return;
        const newCart = { ...cart, [item._id]: cart[item._id] - 1 };
        if (newCart[item._id] <= 0) delete newCart[item._id];
        setCart(newCart);
        calcTotal(newCart);
    };

    const calcTotal = (cartObj) => {
        let sum = 0;
        items.forEach(item => {
            if (cartObj[item._id]) sum += item.price * cartObj[item._id];
        });
        setTotal(sum);
    };

    const handleSubmitBill = async () => {
        try {
            setLoading(true);
            const billItems = items
                .filter(i => cart[i._id])
                .map(i => ({ name: i.name, price: i.price, qty: cart[i._id] }));

            await axios.post("https://madhuli-backend.onrender.com/api/bills", { items: billItems, total });
            setCart({});
            setTotal(0);
        } catch (err) {
            console.error(err);
            alert("Error saving bill");
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newName || !newPrice) return alert("Please enter name and price");
        try {
            setLoading(true);
            await axios.post("https://madhuli-backend.onrender.com/api/items", {
                name: newName,
                price: parseFloat(newPrice),
            });
            setNewName("");
            setNewPrice("");
            fetchItems();
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert("Error adding item");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            setLoading(true);
            await axios.delete(`https://madhuli-backend.onrender.com/api/items/${id}`);
            const newCart = { ...cart };
            if (newCart[id]) {
                delete newCart[id];
                setCart(newCart);
                calcTotal(newCart);
            }
            fetchItems();
        } catch (err) {
            console.error(err);
            alert("Error deleting item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2">
            {/* Toggle Add Item */}
            <Button
                variant={showForm ? "secondary" : "primary"}
                className="mb-2 w-100"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Cancel" : "Add New Item"}
            </Button>

            {/* Collapsible Form */}
            <Collapse in={showForm}>
                <div>
                    <Form className="mb-3" onSubmit={handleAddItem}>
                        <Form.Group className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Item name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Control
                                type="number"
                                placeholder="Price"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100">Save Item</Button>
                    </Form>
                </div>
            </Collapse>

            {/* Item Cards */}
            <Row>
                {items.map(item => (
                    <Col xs={6} md={4} lg={3} key={item._id} className="mb-3">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="d-flex flex-column justify-content-between p-2">
                                {/* Item info */}
                                <div>
                                    <Card.Title className="fs-6 mb-1">{item.name}</Card.Title>
                                    <Card.Text className="text-muted mb-2">₹{item.price}</Card.Text>
                                </div>

                                {/* Quantity controls */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="py-0 px-2"
                                        onClick={() => addQty(item)}
                                    >
                                        +
                                    </Button>
                                    <span className="mx-2">{cart[item._id] || 0}</span>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="py-0 px-2"
                                        onClick={() => removeQty(item)}
                                    >
                                        -
                                    </Button>
                                </div>

                                {/* Delete */}
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mt-2 w-100"
                                    onClick={() => handleDeleteItem(item._id, item.name)}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>


            {/* Total + Submit */}
            <div
                className="position-fixed bottom-0 start-0 end-0 bg-dark text-light p-2 border-top shadow"
                style={{ zIndex: 1050 }}
            >
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Total: ₹{total}</h3>
                    <Button
                        className="ms-3"
                        size="lg"
                        onClick={handleSubmitBill}
                        disabled={!total}
                    >
                        Submit Bill
                    </Button>
                </div>
            </div>

            {loading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style={{ zIndex: 2000 }}>
                    <Spinner animation="border" role="status" variant="light" />
                </div>
            )}
        </div >
    );
};

export default BillingPage;