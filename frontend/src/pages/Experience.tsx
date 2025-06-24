import React from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Container from "../components/Container";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useModal } from "../hooks/useModal";
import ModalComponent from "../components/ModalComponent";
import FormLabel from "@mui/material/FormLabel";


const Experience: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {};
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <PageBreadcrumb pageTitle="Expériences" />
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={handleSubmit}
        title="Ajouter une expérience"
        description="Veuillez remplir les informations suivantes pour ajouter une nouvelle expérience professionnelle."
      >
        <div className="space-y-4">
          <TextField
            id="outlined-basic"
            label="Etablissement"
            size="small"
            variant="outlined"
            fullWidth
            required
          />
          <div className="flex items-center space-x-4">
            <FormControl fullWidth size="small">
              <FormLabel>Date de début * </FormLabel>
              <TextField
                id="outlined-basic"
                size="small"
                type="date"
                variant="outlined"
                fullWidth
                required
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <FormLabel>Date de fin: </FormLabel>
              <TextField
                id="outlined-basic"
                size="small"
                type="date"
                variant="outlined"
                fullWidth
              />
            </FormControl>
          </div>

          <Box
            component="form"
            sx={{ "& .MuiTextField-root": {  } }}
            noValidate
            autoComplete="off"
          >
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-static"
                label="description"
                multiline
                rows={4}
                variant="outlined"
              />
            </FormControl>
          </Box>
        </div>
      </ModalComponent>

      <Container
        title="Expériences"
        leftCompponent={
          <Button variant="contained" color="primary" onClick={openModal}>
            Ajouter
          </Button>
        }
      ></Container>
    </>
  );
};

export default Experience;
