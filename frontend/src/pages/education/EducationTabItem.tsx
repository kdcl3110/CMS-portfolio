import React, { useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { Popconfirm } from "antd";
import { Education, EducationFormPayload } from "../../interfaces/education";
import format_date from "../../utils/format_date";
import {
  deleteEducation,
  getMyEducations,
  updateEducation,
} from "../../slices/education";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";

interface EducationTabItemProps {
  education: Education;
}

const EducationTabItem: React.FC<EducationTabItemProps> = ({ education }) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Entrer l'intitulé de la formation").trim(),
    school: Yup.string().required("Entrer le nom de l'entreprise").trim(),
    start_date: Yup.string().required("Entrer la date de début").trim(),
    description: Yup.string().trim(),
    end_date: Yup.string().trim(),
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

  useEffect(() => {
    setValue("title", education.title);
    setValue("school", education.school);
    setValue("start_date", education.start_date);
    setValue("description", education.description);
    setValue("end_date", education.end_date);
  }, [education.id, isOpen]);

  const updateData = (data: any) => {
    const params: EducationFormPayload = {
      school: data.school,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      title: data.title
      // user: currentUser.id,
    };

    dispatch(updateEducation({ id: education.id, data: params }))
      .unwrap()
      .then((res) => {
        console.log(res);

        closeModal();
        showSucces("Opération réussie");
        dispatch(getMyEducations(""));
      })
      .catch((err) => {
        closeModal();
        showError(err);
      });
  };

  const deleteData = () => {
    dispatch(deleteEducation({ id: education.id }))
      .unwrap()
      .then((res) => {
        console.log(res);
        closeModal();
        showSucces("Opération réussie");
        dispatch(getMyEducations(""));
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
        title="Edition"
        description="Veuillez modifier les informations de la formation."
      >
        <div className="space-y-4">
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
            label="Etablissement"
            size="small"
            variant="outlined"
            value={watchAllFields.school}
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
                value={watchAllFields.start_date}
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
                value={watchAllFields.end_date}
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
                value={watchAllFields.description}
                onChange={(e) => setValue("description", e.target.value)}
                rows={4}
                variant="outlined"
                error={errors.description != null}
              />
            </FormControl>
          </Box>
        </div>
      </ModalComponent>

      <TableRow>
        <TableCell className="px-4 py-3 text-gray-800 font-bold text-start text-theme-sm dark:text-gray-400">
          {education.title}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {education.school}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {format_date(education.start_date, "ll")}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {format_date(education.end_date, "ll")}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {education.description}
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
              title="Supprimer la formation"
              description="Êtes-vous sûr de vouloir supprimer la formation ?"
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

export default EducationTabItem;
