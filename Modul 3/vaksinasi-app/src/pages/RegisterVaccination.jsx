import { Container, FormControl, Row } from "react-bootstrap";
import HeaderVaccination from "../component/HeaderVaccination";
import Session from "../component/Session";

const RegisterVaccination = () => {
    return (
        <>
            <HeaderVaccination title="Register Vaccination" subtitle="Register Vaccination" />
            <Container>
                <div className="my-4">
                    <label for="name">Select Vaccination Date</label>
                    <FormControl type="date"/>
                </div>
                <Row className="mb-5">
                    <Session />
                    <Session />
                    <Session />
                </Row>
                
            </Container>
        </>
    )
};

export default RegisterVaccination;