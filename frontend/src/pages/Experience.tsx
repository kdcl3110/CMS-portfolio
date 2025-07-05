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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import NoData from "../components/NoData";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { createExperience, getMyExperiences } from "../slices/experience";
import { ExperienceFormPayload } from "../interfaces/experience";
import { showError, showSucces } from "../components/Toasts";
import format_date from "../utils/format_date";

const Experience: React.FC = () => {
  const validationSchema = Yup.object().shape({
    company: Yup.string().required("Entrer le nom de l'entreprise").trim(),
    start_date: Yup.string().required("Entrer la date de début").trim(),
    description: Yup.string().trim(),
    end_date: Yup.string().trim(),
  });

  const {
    // register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const { isOpen, openModal, closeModal } = useModal();
  const { experiences } = useSelector((state: RootState) => state.experience);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const newExperience = (data: any) => {
    const params: ExperienceFormPayload = {
      company: data.company,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      user: currentUser.id,
    };

    dispatch(createExperience(params))
      .unwrap()
      .then((res) => {
        console.log(res);
        
        closeModal();
        showSucces("Opération réussie");
        dispatch(getMyExperiences(""));
      })
      .catch((err) => showError(err));
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Expériences" />
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={handleSubmit(newExperience)}
        title="Ajouter une expérience"
        description="Veuillez remplir les informations suivantes pour ajouter une nouvelle expérience professionnelle."
      >
        <div className="space-y-4">
          <TextField
            id="outlined-basic"
            label="Entreprise"
            size="small"
            variant="outlined"
            onChange={(e) => setValue("company", e.target.value)}
            error={errors.company != null}
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
                onChange={(e) => setValue("start_date", e.target.value)}
                error={errors.start_date != null}
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
                onChange={(e) => setValue("end_date", e.target.value)}
                variant="outlined"
                error={errors.end_date != null}
                fullWidth
              />
            </FormControl>
          </div>

          <Box
            component="form"
            sx={{ "& .MuiTextField-root": {} }}
            noValidate
            autoComplete="off"
          >
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-static"
                label="description"
                multiline
                onChange={(e) => setValue("description", e.target.value)}
                rows={4}
                error={errors.description != null}
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
      >
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Company
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Start date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  End date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {experiences.map((experience) => (
                <TableRow key={experience.id}>
                  <TableCell className="px-4 py-3 text-gray-800 text-start font-bold text-theme-sm dark:text-gray-400">
                    {experience.company}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {format_date(experience.start_date, "ll")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {format_date(experience.end_date, "ll")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {experience.description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <IconButton color="info" aria-label="delete" size="large">
                        <DriveFileRenameOutlineIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        aria-label="delete"
                        size="large"
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <NoData show={experiences.length == 0} />
        </div>
      </Container>
    </>
  );
};

export default Experience;
