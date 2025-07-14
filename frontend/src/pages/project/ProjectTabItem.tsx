import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useModal } from "../../hooks/useModal";
import ModalComponent from "../../components/ModalComponent";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { TableCell, TableRow } from "../../components/ui/table";
import IconButton from "@mui/material/IconButton";
import { showError, showSucces } from "../../components/Toasts";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Popconfirm } from "antd";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import { ProjectFormPayload } from "../../interfaces/project";
import { Project } from "../../interfaces/project";
import {
  deleteProject,
  getMyProjects,
  updateProject,
} from "../../slices/project";
import Button from "@mui/material/Button";
import UploadCard from "../../components/UploadCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

interface ProjectTabItemProps {
  project: Project;
}

const ProjectTabItem: React.FC<ProjectTabItemProps> = ({ project }) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Entrer l'intitulé du poste").trim(),
    description: Yup.string().required("Entrer une description").trim(),
    demo_url: Yup.string().default("").trim(),
    github_url: Yup.string().default("").trim(),
  });

  const {
    // register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const watchAllFields = watch();
  // const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, openModal, closeModal } = useModal();
  const [imageError, setImageError] = useState<boolean>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [technologies, setTechnologies] = useState<Array<string>>([]);
  const [tecnology, setTecnology] = useState<string>("");
  const [tecnologyError, setTecnologyError] = useState<boolean>(false);

  useEffect(() => {
    setValue("title", project.title);
    setValue("demo_url", project.demo_url || "");
    setValue("github_url", project.github_url || "");
    setValue("description", project.description || "");
    setTechnologies(project.technologies);
  }, [project.id, isOpen]);

  const updateData = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data?.demo_url) formData.append("demo_url", data.demo_url);
    if (data?.github_url) formData.append("github_url", data.github_url);
    formData.append("technologies", JSON.stringify(technologies));
    if (imageFile) formData.append("image_file", imageFile);

    dispatch(updateProject({ id: project.id, data: formData }))
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

  const deleteData = () => {
    dispatch(deleteProject({ id: project.id }))
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
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={handleSubmit(updateData)}
        title="Ajouter une expérience"
        description="Veuillez remplir les informations suivantes pour ajouter une nouvelle expérience professionnelle."
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            <FormLabel>Visuel du projet * </FormLabel>
            <UploadCard url={project.image_url} onFileSelect={setImageFile} />
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
            value={watchAllFields.title}
            onChange={(e) => setValue("title", e.target.value)}
            error={errors.title != null}
            fullWidth
            required
          />
          <TextField
            id="outlined-basic"
            label="Lien github"
            size="small"
            value={watchAllFields.github_url}
            variant="outlined"
            onChange={(e) => setValue("github_url", e.target.value)}
            error={errors.github_url != null}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Lien de la démo"
            size="small"
            value={watchAllFields.demo_url}
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
                value={watchAllFields.description}
                onChange={(e) => setValue("description", e.target.value)}
                rows={4}
                error={errors.description != null}
                variant="outlined"
              />
            </FormControl>
          </Box>
        </div>
      </ModalComponent>

      <TableRow key={project.id}>
        <TableCell className="px-5 py-4 sm:px-6 text-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img
                width={40}
                height={40}
                src={project.image_url}
                alt={project.title}
              />
            </div>
          </div>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-800 font-bold text-start text-theme-sm dark:text-gray-400">
          {project.title}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {project.technologies_string}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {project.description}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <IconButton
              color="info"
              aria-label="delete"
              size="large"
              onClick={(e) => {
                e.preventDefault();
                openModal();
              }}
            >
              <DriveFileRenameOutlineIcon />
            </IconButton>

            <Popconfirm
              title="Supprimer l'expérience"
              description="Êtes-vous sûr de vouloir supprimer l'expérience' ?"
              onConfirm={deleteData}
              okText="Oui"
              cancelText="Non"
            >
              <IconButton color="error" aria-label="delete" size="large">
                <DeleteOutlineIcon />
              </IconButton>
            </Popconfirm>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProjectTabItem;
