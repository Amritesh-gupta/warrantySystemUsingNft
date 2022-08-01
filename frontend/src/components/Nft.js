import React, { useState } from 'react'
import { Card, Col, ListGroup, Button } from 'react-bootstrap'
import { ethers } from "ethers";
import MyVerticallyCenteredModal from './modal';

const Nft = ({ nft }) => {

  const [showModal, setShowModal] = useState(false);

  const convertTimeAndDate = () => {
    let bigNumber = ethers.BigNumber.from(nft._buyingTime);
    let totalSec = bigNumber.toNumber();

    let date = new Date(totalSec * 1000);

    let buyDate = date.toLocaleDateString("default"); 

    let buyTime = date.toLocaleTimeString("default"); 

    return `${buyDate} ${buyTime}`;
  }


  return (
    <Col md={3}>
      <Card className='my-3 rounded'>
        <Card.Img variant="top" src={nft.productImage} />
        <Card.Body>
          <Card.Title>{`Nft ID: ${nft.nftId}`}</Card.Title>

        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>{`Owner's name: ${nft._ownerName}`}</ListGroup.Item>
          <ListGroup.Item>{`Warranty period: ${nft._warrantyDuration} years`}</ListGroup.Item>
          <ListGroup.Item>{`Buying Date/Time: ${convertTimeAndDate()}`}</ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Button variant="info" onClick={()=>setShowModal(true)}>Transfer Nft</Button>
        </Card.Body>
      </Card>
      <MyVerticallyCenteredModal
        show={showModal}
        onHide={() => setShowModal(false)}
        myAddress = {nft.metaMaskAdd}
        myId = {nft.nftId}
      />
    </Col>
  )
}

export default Nft
