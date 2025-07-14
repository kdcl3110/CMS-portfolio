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
import ServiceTabItem from "./ServiceTabItem";
import { createService, getMyServices } from "../../slices/service";
import UploadCard from "../../components/UploadCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";

const Service: React.FC = () => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Entrer l'intitulé du poste").trim(),
    description: Yup.string().trim(),
    duration_hours: Yup.number().required("Entrer le nom de l'entreprise"),
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

  const { isOpen, openModal, closeModal } = useModal();
  const { services } = useSelector((state: RootState) => state.service);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [tags, setTags] = useState<Array<string>>([]);
  const [tag, setTag] = useState<string>("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [tagError, setTagError] = useState<boolean>(false);
  const [iconError, setIconError] = useState<boolean>();

  const dispatch = useDispatch<AppDispatch>();
  const watchAllFields = watch();

  const newService = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data?.price) formData.append("price", data.price);
    if (data?.duration_hours)
      formData.append("duration_hours", data.duration_hours);
    formData.append("tags", JSON.stringify(tags));
    formData.append("user", currentUser.id.toString());
    if (iconFile) formData.append("icon_file", iconFile);

    dispatch(createService(formData))
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
      <PageBreadcrumb pageTitle="Services" />
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={() => {
          if (iconFile) {
            setIconError(false);
            handleSubmit(newService)();
          } else setIconError(true);
        }}
        title="Ajouter une expérience"
        description="Veuillez remplir les informations suivantes pour ajouter une nouvelle expérience professionnelle."
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            <FormLabel>Visuel du service * </FormLabel>
            <UploadCard onFileSelect={setIconFile} />
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

      <Container
        title="Services"
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
                  Prix
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tags
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Durée
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Durée en jours
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
              {services.map((service) => (
                <ServiceTabItem service={service} key={service.id} />
              ))}
            </TableBody>
          </Table>
          <NoData show={services.length == 0} />
        </div>
      </Container>
    </>
  );
};

export default Service;
