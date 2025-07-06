import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useModal } from "../../hooks/useModal";
import ModalComponent from "../../components/ModalComponent";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { TableCell, TableRow } from "../../components/ui/table";
import IconButton from "@mui/material/IconButton";
import { deleteSocial, getMySocials, updateSocial } from "../../slices/social";
import { showError, showSucces } from "../../components/Toasts";
import { Social, SocialPayload } from "../../interfaces/social";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Popconfirm } from "antd";

interface SocialTabItemProps {
  social: Social;
}

const SocialTabItem: React.FC<SocialTabItemProps> = ({ social }) => {
  const validationSchema = Yup.object().shape({
    link: Yup.string().required("Entrer le nom de l'entreprise").trim(),
    social_type: Yup.number().required("Selectionner la plateforme"),
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

  const { socialTypes } = useSelector((state: RootState) => state.utils);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState<string>("");
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    setValue("social_type", social.social_type_detail.id);
    setValue("link", social.link);
  }, [social.id, isOpen]);

  const updateData = (data: any) => {
    if (data.social_type && data.link) {
      const params: SocialPayload = {
        social_type: data.social_type,
        link: data.link,
        user: currentUser.id,
      };

      dispatch(updateSocial({ id: social.id, data: params }))
        .unwrap()
        .then((res) => {
          console.log(res);

          closeModal();
          setError("");
          showSucces("Opération réussie");
          dispatch(getMySocials(""));
        })
        .catch((err) => {
          closeModal();
          showError(err);
          setError(err);
        });
    } else {
      setError("Sélectionnez la plateforme");
      showError("Sélectionnez la plateforme");
    }
  };

  const deleteData = () => {
    dispatch(deleteSocial({ id: social.id }))
      .unwrap()
      .then((res) => {
        console.log(res);
        closeModal();
        showSucces("Opération réussie");
        dispatch(getMySocials(""));
      })
      .catch((err) => {
        closeModal();
        showError(err);
        setError(err);
      });
  };

  return (
    <>
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={handleSubmit(updateData)}
        title="Edition"
        description="Veuillez modifier les informations du réseau social."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-center text-center">
            {socialTypes.map((platform, index) => (
              <a
                onClick={() => {
                  setValue("social_type", platform.id);
                }}
                key={`${platform.label}-${index}`}
                className={`flex flex-col items-center p-2 rounded-md ${
                  watchAllFields.social_type == platform.id
                    ? "border-2 border-blue-500"
                    : "border"
                } hover:bg-blue-50 hover:shadow-md transition relative`}
                href="#"
              >
                {watchAllFields.social_type == platform.id && (
                  <div className="h-5 w-5 rounded-full flex items-center justify-center bg-blue-500 absolute -top-1 -right-1">
                    <CheckIcon
                      className="text-white font-bold"
                      style={{ fontSize: 15 }}
                    />
                  </div>
                )}
                <img
                  src={platform.logo_url}
                  alt={platform.label}
                  className="w-16 h-16 object-cover rounded-md mb-2"
                />
                <div className="text-sm font-medium text-gray-700">
                  {platform.label}
                </div>
              </a>
            ))}
          </div>

          <TextField
            id="outlined-basic"
            label="Lien du réseau social"
            size="small"
            variant="outlined"
            value={watchAllFields.link}
            onChange={(event) => setValue("link", event.target.value)}
            error={errors?.link != null}
            fullWidth
            required
          />
          <span className="text-red-500">{error.trim() != "" && error}</span>
        </div>
      </ModalComponent>

      <TableRow key={social?.id}>
        <TableCell className="px-5 py-4 sm:px-6 text-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img
                width={40}
                height={40}
                src={social.social_type_detail?.logo_url}
                alt={social.link}
              />
            </div>
          </div>
        </TableCell>

        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {social.link}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                openModal();
              }}
              color="info"
              aria-label="delete"
              size="large"
            >
              <DriveFileRenameOutlineIcon />
            </IconButton>
            <Popconfirm
              title="Supprimer le réseau social"
              description="Êtes-vous sûr de vouloir supprimer ce réseau social ?"
              onConfirm={deleteData}
              okText="Oui"
              cancelText="Non"
            >
              <IconButton
                color="error"
                aria-label="delete"
                size="large"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Popconfirm>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default SocialTabItem;
