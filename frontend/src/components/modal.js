import Modal from 'react-bootstrap/Modal';
import { InputGroup, Form, Button,  Row, Col } from 'react-bootstrap';
import React, { useState } from "react";
import { transferNft } from '../actions/cryptoActions.js'
import { ethers } from "ethers";

function MyVerticallyCenteredModal(props) {
    const [address, setaddress] = useState("");
    const [name, setname] = useState("");


    const transfer = async()=>{
        if (address.length === 0 || !ethers.utils.isAddress(address)) {
            alert('Enter valid recipient address');
        }
        else{
            let istransferred = await transferNft(props.myAddress,address,props.myId,name);
            if(istransferred === 1){
                alert('Successfully transferred');
                window.location.reload();
            }
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Transfer NFT
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <InputGroup className="mt-3 mx-5 mb-3">
                        <Form.Control
                            id="myAddressInp"
                            // className="col-md-4 offset-md-4 mr-1"
                            value={props.myAddress}
                            disabled
                        />
                    </InputGroup>
                </Row>
                <Row id="toCol"><div>{'To'}</div></Row>
                <Row>
                    <InputGroup className="mx-5 mt-3">
                        <Form.Control
                            id="toAddressInp"
                            // className="col-md-4 offset-md-4 mr-1"
                            onChange={(e) => setname(e.target.value)}
                            placeholder="Enter recipient name"
                        />
                    </InputGroup>
                </Row>
                <Row>
                    <InputGroup className="mx-5 mt-3">
                        <Form.Control
                            id="toAddressInp"
                            // className="col-md-4 offset-md-4 mr-1"
                            onChange={(e) => setaddress(e.target.value)}
                            placeholder="Enter recipient metamask's account address"
                        />
                    </InputGroup>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={transfer} variant='info'>Transfer</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyVerticallyCenteredModal;