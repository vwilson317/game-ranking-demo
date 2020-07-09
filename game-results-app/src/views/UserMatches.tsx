import React from "react";
import MatchTable from '../components/MatchTable';

// // reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  CardTitle
} from "reactstrap";

export function UserMatches(props: any) {
    const screenName = props.location.pathname.split("/")[2];
    return (<>
    <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Match Results for: <b>{screenName}</b></CardTitle>
                </CardHeader>
                <CardBody>
                  <MatchTable screenName={screenName}/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    </>)
}