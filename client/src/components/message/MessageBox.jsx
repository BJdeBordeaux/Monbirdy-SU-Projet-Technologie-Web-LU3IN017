import { Container } from "reactstrap";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";
import "./message.css"

export default function MessageBox(){

    return(
        <Container className="messageBox" >
            <MessageForm />
            <hr/>
            <MessageList className="bg-transparent"/>
        </Container>
    );
}