import { Card ,Col,Row} from "react-bootstrap"
import QueueSession from "./QueueSession"

const Session = ()=>{
    return (
        <Col xs={4}>
        <Card>
            <Card.Body>
                <div className="inline mb-2">
                    <h5 className="me-auto">Session 1</h5>
                    <p className="text-muted">09:00 - 11:00</p>
                </div>
                <Row>
                    <QueueSession session="#1" status="active"/>
                    <QueueSession session="#1" status="booked"/>
                    <QueueSession session="#1" status=""/>
                    <QueueSession session="#1" status=""/>
                    <QueueSession session="#1" status=""/>
                    <QueueSession session="#1" status=""/>
                    <QueueSession session="#1" status=""/>
                </Row>
            </Card.Body>
        </Card>
        </Col>
    )
}

export default Session;