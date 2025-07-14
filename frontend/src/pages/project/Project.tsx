import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Container from "../../components/Container";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useModal } from "../../hooks/useModal";
import ModalComponent from "../../components/ModalComponent";
import FormLabel from "@mui/material/FormLabel";
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
import ProjectTabItem from "./ProjectTabItem";
import { createProject, getMyProjects } from "../../slices/project";
import UploadCard from "../../components/UploadCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const Project: React.FC = () => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Entrer l'intitulé du poste").trim(),
    description: Yup.string().required("Entrer une description").trim(),
    demo_url: Yup.string().trim(),
    github_url: Yup.string().trim(),
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
  const { projects } = useSelector((state: RootState) => state.project);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [technologies, setTechnologies] = useState<Array<string>>([]);
  const [tecnology, setTecnology] = useState<string>("");
  const [tecnologyError, setTecnologyError] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const newProject = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data?.demo_url) formData.append("demo_url", data.demo_url);
    if (data?.github_url) formData.append("github_url", data.github_url);
    formData.append("technologies", JSON.stringify(technologies));
    formData.append("user", currentUser.id.toString());
    if (imageFile) formData.append("image_file", imageFile);

    dispatch(createProject(formData))
      .unwrap()
      .then((res) => {
        console.log(res);
        closeModal();
        showSucces("Opération réussie");
        dispatch(getMyProjects(""));
      })
      .catch((err) => {
        closeModal();
        showError(err);
      });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Projets" />
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={() => {
          if (imageFile) {
            setImageError(false);
            handleSubmit(newProject)();
          } else setImageError(true);
        }}
        title="Ajouter une expérience"
        description="Veuillez remplir les informations suivantes pour ajouter une nouvelle expérience professionnelle."
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            <FormLabel>Visuel du projet * </FormLabel>
            <UploadCard onFileSelect={setImageFile} />
            {imageError && (
              <span className="text-red-500">
                Veuiller sélecrtionner un visuel
              </span>
            )}
          </div>
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
            label="Lien github"
            size="small"
            variant="outlined"
            onChange={(e) => setValue("github_url", e.target.value)}
            error={errors.github_url != null}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Lien de la démo"
            size="small"
            variant="outlined"
            onChange={(e) => setValue("demo_url", e.target.value)}
            error={errors.demo_url != null}
            fullWidth
          />
          <div className="space-y-2">
            <FormLabel>Technologies utilisées</FormLabel>
            <div className="flex items-center space-x-4">
              <TextField
                id="outlined-basic"
                label="Technologie"
                size="small"
                value={tecnology}
                variant="outlined"
                onChange={(e) => setTecnology(e.target.value)}
                error={tecnologyError}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (tecnology.trim() != "") {
                    setTechnologies((prev) => [...prev, tecnology]);
                    setTecnology("");
                    setTecnologyError(false);
                  } else {
                    setTecnologyError(true);
                  }
                }}
              >
                <AddCircleOutlineIcon />
              </Button>
            </div>
            <div className="flex items-center space-x-2 space-y-2 flex-wrap">
              {technologies.map((technology) => (
                <a
                  href="#"
                  className="py-1 px-2 rounded-full bg-blue-200 text-blue-800"
                  onClick={() => {
                    setTechnologies((prev) =>
                      prev.filter((e) => e != technology)
                    );
                  }}
                >
                  {technology} <CloseIcon fontSize="small" />
                </a>
              ))}
            </div>
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
        title="Projets"
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
                  Apperçu
                </TableCell>
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
                  Technogies
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
              {projects.map((project) => (
                <ProjectTabItem project={project} key={project.id} />
              ))}
            </TableBody>
          </Table>
          <NoData show={projects.length == 0} />
        </div>
      </Container>
    </>
  );
};

export default Project;
