import { useState } from 'react'
import { InputGroup, Modal, Container, Form, Button, } from 'react-bootstrap'


function UserSelect(props) {
    const [user, setUser] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    function handleInputChange(e) {
        setUser(e.target.value)
    }

    function verifyUser() {
        return user.trim().length > 0
    }

    const handleOpenSuccessModal = () => setShowSuccessModal(true)
    const handleCloseSuccessModal = () => setShowSuccessModal(false)

    function handleSubmit(e) {
        e.preventDefault();
        console.log(`username: ${user}`);
        if (!verifyUser()) {
            // no good
            console.log("Error: Username was empty")
        } else {
            // go to chat room
            console.log(`Success: Username set to ${user}`)
            handleOpenSuccessModal()
        }
    }

    function gotoChat() {
        handleCloseSuccessModal()
        console.log("callback triggered")
        props.setUser(user)
    }

    return (
        <Container style={{ width: '50%' }}>
            <Form onSubmit={handleSubmit}>
                <Form.Label>Display Name</Form.Label>
                <Form.Group style={{ display: 'flex' }}>
                    <Form.Control
                        type="text"
                        id="display-name"
                        placeholder="Enter your display name..."
                        onChange={(e) => handleInputChange(e)}
                    />
                    <Button
                        type="submit"
                        style={{ display: 'flex', whiteSpace: 'nowrap' }} variant="success"
                        value={user}
                    >
                        Enter Chat
                    </Button>
                </Form.Group>
            </Form>

            <Modal
                show={showSuccessModal}
                onHide={gotoChat}
                closeVariant='success'
                closeButton='true'
                closeLabel='Go to Chat'
            >
                <Modal.Header>
                    <Modal.Title>
                        Login Successful
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> You have logged in to the chat room with the display name: "{user}".</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={gotoChat}>Continue to Chat Room</Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
}

function ChatRoom(props) {
    const [user, setUser] = useState(props.user)
    const [msg, setMsg] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Sending message: ${msg}`);
        setMsg('');
    }

    const handleInputChange = (e) => {
        setMsg(e.target.value)
    }

    return (
        <Container style={{ width: '80%' }}>
            <h3> Welcome, {user}!</h3>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Control
                    as="textarea"
                    readOnly={true}
                    style={{
                        height: '400px',
                        overflowY: 'scroll',
                        resize: 'none',
                    }}
                />
                <InputGroup>
                    <InputGroup.Text>{user}</InputGroup.Text>
                    <Form.Control
                        placeholder="Type in a message..."
                        style={{
                            resize: 'none'
                        }}
                        onChange={(e) => handleInputChange(e)}
                        value={msg}
                    />
                    <Button
                        type="submit"
                        variant="success"
                        value={msg}
                    >
                        Send
                    </Button>
                </InputGroup>
            </Form>
        </Container>
    );
}

function ChatApp() {
    const [user, setUser] = useState('')

    const handleCallback = (userFromSelect) => {
        setUser(userFromSelect)
    }

    return (
        <>
            {user.length === 0 ?
                <UserSelect setUser={handleCallback} /> : <ChatRoom user={user} />}
        </>
    );
}

export default ChatApp;