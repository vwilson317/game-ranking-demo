import React from "react";
import MatchTable from '../components/MatchTable';
import { useSelector, useDispatch } from 'react-redux';

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
  Col,
  CardTitle
} from "reactstrap";
import { selectScreenName } from '../features/counterSlice';

type UserMatchesProps = {
    screenName: string
}

export function UserMatches(props: any) {
    const screenName = props.location.pathname.split("/")[2];
    return (<>
    <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">{screenName} Match Results</CardTitle>
                </CardHeader>
                <CardBody>
                  <MatchTable />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    </>)
}