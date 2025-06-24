import React, { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import UploadCard from "../components/UploadCard";
import Button from "@mui/material/Button";

const GridItem = ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title?: string;
}) => {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-md shadow-sm p-3 space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

const Personal: React.FC = () => {
  const handleSubmit = () => {};
  return (
    <>
      <PageBreadcrumb pageTitle="Infos personnelles" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <GridItem title="Infos personnelles">
          <TextField
            id="outlined-basic"
            label="Email"
            size="small"
            variant="outlined"
            fullWidth
            type="email"
            required
          />
          <TextField
            id="outlined-basic"
            label="username"
            size="small"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            id="outlined-basic"
            label="Last name"
            size="small"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="First name"
            size="small"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Phone number"
            type="tel"
            // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            helperText="Format: 123-456-7890"
            size="small"
            variant="outlined"
            fullWidth
          />
        </GridItem>
        <GridItem title="Biographie">
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1 } }}
            noValidate
            autoComplete="off"
          >
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-static"
                label="Biography"
                multiline
                rows={10}
                variant="outlined"
              />
            </FormControl>
          </Box>
        </GridItem>
        <GridItem title="Adresse">
          <TextField
            id="outlined-basic"
            label="Country"
            size="small"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="City"
            size="small"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Code postal"
            size="small"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Street"
            size="small"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="House number"
            type="number"
            size="small"
            variant="outlined"
            fullWidth
          />
        </GridItem>
        <GridItem title="Photo de profil">
          <UploadCard
            width="w-full"
            height="h-48"
            onFileSelect={(file) => {
              console.log("Selected file:", file);
            }}
          />
        </GridItem>
        <GridItem title="Banner">
          <UploadCard
            width="w-full"
            height="h-48"
            onFileSelect={(file) => {
              console.log("Selected file:", file);
            }}
          />
        </GridItem>
        <GridItem title="Terminer">
          <div>
            Si les modifications sont terminés vous pouvouer les enregistrer en
            cliquant sur le bouton suivant
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Enregister
          </Button>
        </GridItem>
      </div>
    </>
  );
};

export default Personal;
