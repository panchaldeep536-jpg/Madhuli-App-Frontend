import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Button, Form, Collapse } from "react-bootstrap";

const BillingPage = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState({});
    const [total, setTotal] = useState(0);

    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get("https://madhuli-server.onrender.com/api/items").then(res => setItems(res.data));
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
        const billItems = items
            .filter(i => cart[i._id])
            .map(i => ({ name: i.name, price: i.price, qty: cart[i._id] }));

        await axios.post("https://madhuli-server.onrender.com/api/bills", { items: billItems, total });
        setCart({});
        setTotal(0);
        alert("Bill saved!");
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newName || !newPrice) return alert("Please enter name and price");
        try {
            await axios.post("https://madhuli-server.onrender.com/api/items", {
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
        }
    };

    const handleDeleteItem = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await axios.delete(`https://madhuli-server.onrender.com/api/items/${id}`);
            fetchItems();
        } catch (err) {
            console.error(err);
            alert("Error deleting item");
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
                    <Col xs={12} key={item._id} className="mb-2">
                        <Card className="p-2">
                            <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                <div className="mb-2 mb-md-0">
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>₹{item.price}</Card.Text>
                                </div>
                                <div className="d-flex align-items-center mb-2 mb-md-0">
                                    <Button variant="success" size="lg" className="me-2 py-1 px-3" onClick={() => addQty(item)}>+</Button>
                                    <span className="mx-2 fs-5">{cart[item._id] || 0}</span>
                                    <Button variant="danger" size="lg" className="ms-2 py-1 px-3" onClick={() => removeQty(item)}>-</Button>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    className="mt-2 mt-md-0 py-1 px-3"
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
            <h3 className="mt-3">Total: ₹{total}</h3>
            <Button className="w-100 mt-2 mb-3" size="lg" onClick={handleSubmitBill} disabled={!total}>
                Submit Bill
            </Button>
        </div>
    );
};

export default BillingPage;