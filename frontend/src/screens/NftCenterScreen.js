import React, { useState } from "react";
import { InputGroup, Form, Button, Container, Row, Alert, Col } from 'react-bootstrap';
import { ethers } from "ethers";
import { checkBalance, getAddress, getAllIds, getAllNftDetails } from '../actions/cryptoActions.js'
import Loader from '../components/Loader'
import Nft from "../components/Nft.js";
import axios from 'axios';


const NftCenterScreen = () => {

    const [show, setShow] = useState(false);
    const [isInProcess, setIsInProcess] = useState(false);
    const [address, setaddress] = useState("");
    const [balance, setBalance] = useState(-1);
    const [alldetails, setAllDetails] = useState(null);

    const disableBtn = () => {
        const btn = document.getElementById("checkBtn");
        btn.disabled = true;
    }

    const enableBtn = () => {
        const btn = document.getElementById("checkBtn");
        btn.disabled = false;
    }

    const check = async () => {
        let temp;

        if (address.length === 0 || !ethers.utils.isAddress(address)) {
            setShow(true)
        }
        else {
            disableBtn();
            setIsInProcess(true);
            let balance = await checkBalance(address);
            temp = (balance === null) ? 0 : 1;
            if (temp === 1) {
                let bigNumber = ethers.BigNumber.from(balance);
                let totalBal = bigNumber.toNumber();
                if (totalBal === 0) {
                    setBalance(0);
                    enableBtn();
                    setIsInProcess(false);
                }
                else {
                    let nftIds = await getAllIds(address);
                    let allIds = nftIds.filter((id) => {
                        let tempBig = ethers.BigNumber.from(id);
                        id = tempBig.toNumber();
                        return id !== 0;
                    })
                    let promises = allIds.map(async (id) => {
                        let detail = await getAllNftDetails(id);
                        let imageLink;
                        try {
                            const { data } = await axios.get(`/api/products/${detail._serialId}`)
                            imageLink = data.image;
                        }
                        catch (err) {
                            imageLink = '/images/alexa.jpg';
                        }
                        return ({
                            ...detail,
                            nftId: id,
                            productImage: imageLink,
                            metaMaskAdd: address
                        })

                    })

                    let NftDetails = await Promise.all(promises);

                    console.log(NftDetails)
                    setAllDetails(NftDetails);
                    setIsInProcess(false);
                }
            }
            else {
                enableBtn();
                setIsInProcess(false);
            }
        }
    }

    const autoFill = async () => {
        let address = await getAddress();
        if (address !== null) {
            let inp = document.getElementById('addressInp');
            inp.value = address;
            setaddress(address);
        }
    }

    return (
        (alldetails === null) ? (
            <Container>
                <Row className="mb-5">
                    <InputGroup className="mt-5 mr-5">
                        <Form.Control
                            id="addressInp"
                            className="col-md-4 offset-md-4 mr-1"
                            onChange={(e) => setaddress(e.target.value)}
                            placeholder="Enter Metamask's account address"
                        />
                        <Button variant="outline-info" size="sm" onClick={autoFill}>
                            Auto
                        </Button>
                    </InputGroup>
                </Row>
                <Row id="checkBtnDiv" className="mb-4">
                    <Button variant="info" onClick={check} id="checkBtn">
                        Check
                    </Button>
                </Row>
                <Row>
                    {isInProcess && <Loader />}
                </Row>
                <Row id="error">
                    <Col>
                        {show &&
                            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                <p>
                                    Please enter valid account address
                                </p>
                            </Alert>
                        }
                        {(balance === 0) &&
                            <Alert variant="danger" onClose={() => setBalance(-1)} dismissible>
                                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                <p>
                                    You own 0 Nft's
                                </p>
                            </Alert>
                        }
                    </Col>
                </Row>
            </Container>) : (
            <Col className="d-flex flex-wrap">
                {alldetails.map((item, index) =>
                    <Nft nft={item} key={index} />
                )}
            </Col>
        )

    );
}

export default NftCenterScreen;