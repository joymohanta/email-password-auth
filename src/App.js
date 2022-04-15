import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "./firebase.init";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };

  const handleChanged = (event) => {
    setSignUp(event.target.checked);
  };
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email verification sent");
    });
  };

  const handleForgetPassword = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("send email for reset Password");
    });
  };
  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    setValidated(true);

    if (signUp) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          verifyEmail();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    event.preventDefault();
  };
  return (
    <div className="App">
      <div className="registration w-50 mx-auto my-4">
        <h2 className="text-primary text-center">
          Please {signUp ? "Log In" : "Sign Up"} !!
        </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleChanged}
              type="checkbox"
              label="Already have an account?"
            />
            <Button onClick={handleForgetPassword} variant="link">
              Forget Password
            </Button>
          </Form.Group>
          <Button variant="primary" type="submit">
            {signUp ? "Log In" : "Sign Up"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
