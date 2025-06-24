import React, { FormEvent, use, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../../shared-theme/AppTheme";
import ColorModeSelect from "../../shared-theme/ColorModeSelect";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "./components/CustomIcons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { register } from "../../slices/auth";
import { RegisterPayload } from "../../interfaces/auth";
import { showError, showSucces } from "../../components/Toasts";
import { Navigate, useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
    useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [firsNameError, setFirstNameError] = useState(false);
  const [firsNameErrorMessage, setFirstNamerMessage] = useState("");

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const passwordConfirm = document.getElementById(
      "password_confirm"
    ) as HTMLInputElement;
    const username = document.getElementById("username") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!passwordConfirm.value || passwordConfirm.value !== password.value) {
      setPasswordConfirmError(true);
      setPasswordConfirmErrorMessage("Passwords do not match.");
      isValid = false;
    } else {
      setPasswordConfirmError(false);
      setPasswordConfirmErrorMessage("");
    }

    if (!username.value || username.value.length < 1) {
      setUserNameError(true);
      setUserNameErrorMessage("username is required.");
      isValid = false;
    } else {
      setUserNameError(false);
      setUserNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      userNameError ||
      emailError ||
      passwordError ||
      passwordConfirmError ||
      firsNameError ||
      lastNameError
    ) {
      return;
    }

    const formDate = new FormData(event.currentTarget);

    const data: RegisterPayload = {
      email: formDate.get("email") as string,
      password: formDate.get("password") as string,
      password_confirm: formDate.get("password_confirm") as string,
      username: formDate.get("username") as string,
      firstName: formDate.get("firstName") as string,
      lastName: formDate.get("lastName") as string,
    };

    dispatch(register(data))
      .unwrap()
      .then(() => {
        showSucces("Registration successful!");
        navigate("/signin");
      })
      .catch((error) => {
        showError(error);

        console.error("Registration failed:", error);
        // if (error.response && error.response.data) {
        //   const { username, email, firstName, lastName } = error.response.data;
        //   if (username) {
        //     setUserNameError(true);
        //     setUserNameErrorMessage(username[0]);
        //   }
        //   if (email) {
        //     setEmailError(true);
        //     setEmailErrorMessage(email[0]);
        //   }
        //   if (firstName) {
        //     setFirstNameError(true);
        //     setFirstNamerMessage(firstName[0]);
        //   }
        //   if (lastName) {
        //     setLastNameError(true);
        //     setLastNameErrorMessage(lastName[0]);
        //   }
        // } else {
        //   alert("An unexpected error occurred. Please try again later.");
        // }
      });
  };


  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="username">
                username <span className="text-red-500">*</span>
              </FormLabel>
              <TextField
                autoComplete="username"
                name="username"
                required
                fullWidth
                id="username"
                placeholder="aaaaa"
                error={userNameError}
                helperText={userNameErrorMessage}
                color={userNameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="lastname">Last Name</FormLabel>
              <TextField
                autoComplete="lastName"
                name="lastName"
                fullWidth
                id="lastName"
                placeholder="Jon Snow"
                error={lastNameError}
                helperText={lastNameErrorMessage}
                color={lastNameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">First Name</FormLabel>
              <TextField
                autoComplete="firstName"
                name="firstName"
                fullWidth
                id="firstName"
                placeholder="Jon Snow"
                error={firsNameError}
                helperText={firsNameErrorMessage}
                color={firsNameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password_confirm">
                Password confirm <span className="text-red-500">*</span>
              </FormLabel>
              <TextField
                required
                fullWidth
                name="password_confirm"
                placeholder="••••••"
                type="password"
                id="password_confirm"
                autoComplete="new-password"
                variant="outlined"
                error={passwordConfirmError}
                helperText={passwordConfirmErrorMessage}
                color={passwordConfirmError ? "error" : "primary"}
              />
            </FormControl>
            {/* <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
          {/* <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                href="/signin"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box> */}
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
