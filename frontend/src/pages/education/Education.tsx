import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Container from "../../components/Container";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import ModalComponent from "../../components/ModalComponent";
import { useModal } from "../../hooks/useModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import NoData from "../../components/NoData";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { showError, showSucces } from "../../components/Toasts";
import { EducationFormPayload } from "../../interfaces/education";
import { createEducation, getMyEducations } from "../../slices/education";
import EducationTabItem from "./EducationTabItem";

const Education: React.FC = () => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Entrer l'intitulé de la formation'").trim(),
    school: Yup.string().required("Entrer le nom de l'établissement").trim(),
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
  const { educations } = useSelector((state: RootState) => state.education);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const newEducation = (data: any) => {
    const params: EducationFormPayload = {
      school: data.school,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      user: currentUser.id,
      title: data.title,
    };

    dispatch(createEducation(params))
      .unwrap()
      .then((res) => {
        console.log(res);

        closeModal();
        showSucces("Opération réussie");
        dispatch(getMyEducations(""));
      })
      .catch((err) => showError(err));
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Education" />
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={handleSubmit(newEducation)}
        title="Ajouter une education"
        description="Veuillez remplir les informations suivantes pour ajouter une nouvelle education."
      >
        <div className="space-y-4">
          <TextField
            id="outlined-basic"
            label="Intitulé"
            size="small"
            variant="outlined"
            onChange={(e) => setValue("title", e.target.value)}
            error={errors.title != null}
            fullWidth
            required
          />
          <TextField
            id="outlined-basic"
            label="Etablissement"
            size="small"
            variant="outlined"
            onChange={(e) => setValue("school", e.target.value)}
            error={errors.school != null}
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
                variant="outlined"
                onChange={(e) => setValue("end_date", e.target.value)}
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
                variant="outlined"
                error={errors.description != null}
              />
            </FormControl>
          </Box>
        </div>
      </ModalComponent>

      <Container
        title="Education"
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
                  Intitulé
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  2tablissement
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date de début
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date de fin
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
              {educations.map((education) => (
                <EducationTabItem education={education} key={education.id} />
              ))}
            </TableBody>
          </Table>
          <NoData show={educations.length == 0} />
        </div>
      </Container>
    </>
  );
};

export default Education;
