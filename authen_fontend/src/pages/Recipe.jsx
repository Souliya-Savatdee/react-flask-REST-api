import React from "react";
import { Button, Card } from "react-bootstrap";

//Form format

function Recipe({ title, description, onClickChange, onClickDelete}) {
  return (
    <Card style={{ width: "18rem" }} className="recipe">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <div>
        <Button variant="dark" onClick={onClickChange}>Update</Button>
        <Button variant="danger" onClick={onClickDelete}>Delete</Button>

        </div>

      </Card.Body>
    </Card>
  );
}

export default Recipe;
