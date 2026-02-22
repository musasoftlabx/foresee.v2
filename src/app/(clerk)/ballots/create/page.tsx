"use client";

// * React
import { useState } from "react";

// * MUI
import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";

// * Components
import AppDrawer from "@/components/Layouts/AppDrawer";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";

// * Constants
const steps = ["Ballot details", "Dockets"];

export default function CreateBallot() {
  // ? States
  const [activeStep, setActiveStep] = useState(3);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <AppDrawer>
      <Container maxWidth="sm">
        <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === 1 && <Step1 setActiveStep={setActiveStep} />}

        {activeStep === 2 && <Step2 setActiveStep={setActiveStep} />}

        {activeStep === 3 && <Step3 setActiveStep={setActiveStep} />}

        {activeStep !== 1 && (
          <Box display="flex" flexDirection="row" pt={2}>
            <Button
              color="inherit"
              disabled={activeStep === 1}
              onClick={() =>
                setActiveStep((prevActiveStep) => prevActiveStep - 1)
              }
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box flex="1 1 auto" />
            <Button
              onClick={() =>
                setActiveStep((prevActiveStep) => prevActiveStep + 1)
              }
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        )}
      </Container>
    </AppDrawer>
  );
}
