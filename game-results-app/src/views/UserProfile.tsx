// /*!

// =========================================================
// * Black Dashboard React v1.1.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/black-dashboard-react
// * Copyright 2020 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

// * Coded by Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */
import React, { useState } from "react";

// // reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";
import Axios from "axios";
import { IMatch, IPlayer } from '../components/MatchTable';
import moment from "moment";



function UserProfile() {
  const [playerStandings, setPlayerStandings] = useState('')

  function SaveMatchResults(e: any) {
    debugger
    if (e !== undefined) { e.preventDefault() };
    Axios.post('matches', playerStandings)
  }

  const handleChange = (event: any) => {
    setPlayerStandings(event.target.value);
  };
 
  const handleSubmit = (event: any) => {
    if(playerStandings !== ""){
      const players = playerStandings.split(',').map(x => 
        {
          return {
            screenName: x
          } as IPlayer
        })
        const matchDto = {
          standings: players
        } as IMatch
        debugger
        console.log(matchDto)
      Axios.post('api/matches', matchDto).then(() => {
        alert('Saved Successfully');
        setPlayerStandings('');
      })
    }
    event.preventDefault();
  };

  // function handleChange(event) {
  //   this.setState({value: event.target.value});
  // }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Match Inputs</h5>
              </CardHeader>
              <Form onSubmit={(e: any) => handleSubmit(e)}>
              <CardBody>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Match results (in oder of finish)</label>
                        <Input
                          defaultValue=""
                          placeholder="i.e player7, player2, player100, player4, player8 ..."
                          type="text"
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" type="submit"
                  // onClick={SaveMatchResults}
                  >
                  Save
                  </Button>
              </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default UserProfile;
