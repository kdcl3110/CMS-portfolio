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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { Popconfirm } from "antd";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import { Service, ServiceFormPayload } from "../../interfaces/service";
import {
  deleteService,
  getMyServices,
  updateService,
} from "../../slices/service";
import UploadCard from "../../components/UploadCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";

interface ServiceTabItemProps {
  service: Service;
}

const ServiceTabItem: React.FC<ServiceTabItemProps> = ({ service }) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required().trim(),
    description: Yup.string().trim(),
    duration_hours: Yup.number().required(),
    is_active: Yup.boolean().default(false),
    price: Yup.number().required(),
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
  const [tags, setTags] = useState<Array<string>>([]);
  const [tag, setTag] = useState<string>("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [tagError, setTagError] = useState<boolean>(false);
  const [iconError, setIconError] = useState<boolean>();

  useEffect(() => {
    setValue("title", service.title);
    setValue("is_active", service.is_active);
    setValue("description", service.description);
    setValue("duration_hours", service.duration_hours);
    setValue("price", service.price);
    setTags(service.tags);
  }, [service.id, isOpen]);

  const updateData = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data?.price) formData.append("price", data.price);
    if (data?.duration_hours)
      formData.append("duration_hours", data.duration_hours);
    formData.append("tags", JSON.stringify(tags));
    if (iconFile) formData.append("icon_file", iconFile);

    dispatch(updateService({ id: service.id, data: formData }))
      .unwrap()
      .then((res) => {
        console.log(res);

        closeModal();
        showSucces("Opération réussie");
        dispatch(getMyServices(""));
      })
      .catch((err) => {
        closeModal();
        showError(err);
      });
  };

  const deleteData = () => {
    dispatch(deleteService({ id: service.id }))
      .unwrap()
      .then((res) => {
        console.log(res);
        closeModal();
        showSucces("Opération réussie");
        dispatch(getMyServices(""));
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
          <div className="flex flex-col items-center justify-center">
            <FormLabel>Visuel du service * </FormLabel>
            <UploadCard url={service.icon_url} onFileSelect={setIconFile} />
            {iconError && (
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
            label="Prix du service"
            type="number"
            value={watchAllFields.price}
            size="small"
            variant="outlined"
            onChange={(e) => setValue("price", Number(e.target.value))}
            error={errors.price != null}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              },
            }}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Durée du service"
            size="small"
            variant="outlined"
            value={watchAllFields.duration_hours}
            type="number"
            onChange={(e) => setValue("duration_hours", Number(e.target.value))}
            error={errors.duration_hours != null}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">heure</InputAdornment>
                ),
              },
            }}
            fullWidth
          />
          <div className="space-y-2">
            <FormLabel>Tags </FormLabel>
            <div className="flex items-center space-x-4">
              <TextField
                id="outlined-basic"
                label="tag"
                size="small"
                value={tag}
                variant="outlined"
                onChange={(e) => setTag(e.target.value)}
                error={tagError}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (tag.trim() != "") {
                    setTags((prev) => [...prev, tag]);
                    setTag("");
                    setTagError(false);
                  } else {
                    setTagError(true);
                  }
                }}
              >
                <AddCircleOutlineIcon />
              </Button>
            </div>
            <div className="flex items-center space-x-2 space-y-2 flex-wrap">
              {tags.map((tag) => (
                <a
                  href="#"
                  className="py-1 px-2 rounded-full bg-blue-200 text-blue-800"
                  onClick={() => {
                    setTags((prev) => prev.filter((e) => e != tag));
                  }}
                >
                  {tag} <CloseIcon fontSize="small" />
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
                value={watchAllFields.description}
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

      <TableRow key={service.id}>
        <TableCell className="px-5 py-4 sm:px-6 text-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img
                width={40}
                height={40}
                src={service.icon_url}
                alt={service.icon_url}
              />
            </div>
          </div>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-800 text-start font-bold text-theme-sm dark:text-gray-400">
          {service.title}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {service.price_display}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {service.tags_string}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {service.duration_hours + " h"}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {service.duration_display}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {service.description}
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

export default ServiceTabItem;
