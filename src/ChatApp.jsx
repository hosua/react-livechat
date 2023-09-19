import { useState, useEffect } from 'react'
import { InputGroup, Modal, Container, Form, Button, } from 'react-bootstrap'
import io from 'socket.io-client'

// const socket = io('http://127.0.0.1:3003')
const socket = io('http://127.0.0.1:3003', {
    transports: ['websocket']
})

function fmtTimestamp(ts) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date(ts));

    return formattedDate;
}

function UserSelect(props) {
    const [user, setUser] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);

    function handleInputChange(e) {
        setUser(e.target.value)
    }

    function verifyUser() {
        return user.trim().length > 0
    }

    const handleOpenSuccessModal = () => setShowSuccessModal(true)
    const handleCloseSuccessModal = () => setShowSuccessModal(false)

    const handleOpenFailModal = () => setShowFailModal(true)
    const handleCloseFailModal = () => setShowFailModal(false)

    function handleSubmit(e) {
        e.preventDefault();
        console.log(`username: ${user}`);
        if (!verifyUser()) {
            // no good
            console.log("Error: Username was empty")
            handleOpenFailModal()
        } else {
            // go to chat room
            console.log(`Success: Username set to ${user}`)
            handleOpenSuccessModal()
        }
    }

    function gotoChat() {
        handleCloseSuccessModal()
        console.log("Going to the Chat App")
        props.setUser(user.trim())
    }

    return (
        <Container style={{ width: '50%' }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group style={{ display: 'flex' }}>
                    <InputGroup>
                        <InputGroup.Text>
                            Display Name
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            id="display-name"
                            placeholder="Enter your display name..."
                            onChange={(e) => handleInputChange(e)}
                        />
                        <Button
                            type="submit"
                            variant="success"
                            value={user}
                        >
                            Enter Chat
                        </Button>
                    </InputGroup>
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
                    <p>You have logged in to the chat room with the display name:</p>
                    <p>{user}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={gotoChat}>Continue to Chat Room</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showFailModal}
                onHide={handleCloseFailModal}
                closeVariant='danger'
                closeButton='true'
                closeLabel='Go Back'
            >
                <Modal.Header>
                    <Modal.Title>
                        Login Failed
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> Your username can not be empty! </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseFailModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
}

function ChatRoom(props) {
    const [user, setUser] = useState(props.user)
    const [userIP, setUserIP] = useState(0)
    const [chatData, setChatData] = useState([])
    const [msg, setMsg] = useState('')

    const appendMsg = (newMsg) => setChatData((prevChatData => [...prevChatData, newMsg]));

    useEffect(() => {
        console.log(`Connecting to server...`)

        socket.on("connect_error", (err) => {
            console.log(`connect_error: ${err}`)
        });

        // connect to server
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [])

    // Ensure that message doesn't fire twice (I need to look into why this is actually working, lol)
    useEffect(() => {
        socket.on('message', (response) => {
            appendMsg(response);
        });
        return () => {
            socket.off('message')
        };
    }, [])

    // Grab user IP address when the page loads
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setUserIP(data.ip))
            .catch(error => console.log(error))
    })

    const sendMsg = async (e) => {
        console.log("Sending message to the server")
        e.preventDefault();
        if (msg.trim().length !== 0) {
            socket.emit('message', {
                username: user,
                msg: msg,
            });
        }
        setMsg('');
    }

    const handleInputChange = (e) => setMsg(e.target.value)

    return (
        <Container style={{ width: '80%' }}>
            <h3> Welcome, {user}!</h3>
            <Form onSubmit={(e) => sendMsg(e)}>
                <Form.Control
                    as="textarea"
                    readOnly={true}
                    style={{
                        height: '50vh',
                        overflowY: 'scroll',
                        resize: 'none',
                    }}
                    value={chatData.map((m) => `[${m.posted_on}] ${m.username}: ${m.msg}`).join('\n')}
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

    const setSelectedUser = (userFromSelect) => {
        setUser(userFromSelect)
    }

    return <>
        {user.length === 0 ? <UserSelect setUser={setSelectedUser} /> : <ChatRoom user={user} />}
    </>
}

export default ChatApp;