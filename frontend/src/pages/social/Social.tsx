import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Container from "../../components/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useModal } from "../../hooks/useModal";
import ModalComponent from "../../components/ModalComponent";
import CheckIcon from "@mui/icons-material/Check";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { createSocials, getMySocials } from "../../slices/social";
import { showError, showSucces } from "../../components/Toasts";
import { SocialPayload } from "../../interfaces/social";
import NoData from "../../components/NoData";
import SocialTabItem from "./SocialTabItem";

const Social: React.FC = () => {
  const { socialTypes } = useSelector((state: RootState) => state.utils);
  const { socials } = useSelector((state: RootState) => state.social);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string>("");

  const [link, setLink] = useState<string>("");

  const [selectdPlatform, setSelectedPlatform] = React.useState<{
    id: number;
    name?: string;
    logo?: string;
  } | null>(socialTypes[0] || null);

  const {
    isOpen,
    openModal,
    closeModal,
  } = useModal();

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = () => {
    if (selectdPlatform?.id) {
      if (link.trim() !== "") {
        const data: SocialPayload = {
          social_type: selectdPlatform.id,
          link,
          user: currentUser.id,
        };

        dispatch(createSocials(data))
          .unwrap()
          .then((res) => {
            console.log(res);

            closeModal();
            setError("");
            showSucces("Opération réussie");
            dispatch(getMySocials(""));
          })
          .catch((err) => {
            showError(err);
            setError(err);
          });
      } else {
        setError("L'url de la plateforme ets requise");
        showError("L'url de la plateforme ets requise");
      }
    } else {
      setError("Sélectionnez la plateforme");
      showError("Sélectionnez la plateforme");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Réseaux sociaux" />

      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={handleSubmit}
        title="Ajouter un réseau social"
        description="Veuillez remplir les informations du réseau social."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-center text-center">
            {socialTypes.map((platform, index) => (
              <a
                onClick={() => {
                  setSelectedPlatform(platform);
                }}
                key={`${platform.label}-${index}`}
                className={`flex flex-col items-center p-2 rounded-md ${
                  selectdPlatform?.id == platform.id
                    ? "border-2 border-blue-500"
                    : "border"
                } hover:bg-blue-50 hover:shadow-md transition relative`}
                href="#"
              >
                {selectdPlatform?.id == platform.id && (
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
            onChange={(event) => setLink(event.target.value)}
            error={error.trim() != ""}
            fullWidth
            required
          />
          <span className="text-red-500">{error.trim() != "" && error}</span>
        </div>
      </ModalComponent>

      <Container
        title="Réseaux sociaux"
        leftCompponent={
          <Button variant="contained" color="primary" onClick={openModal}>
            Ajouter
          </Button>
        }
      >
        <div className="max-w-full overflow-x-auto pt-4">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Plateforme
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Lien
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
              {socials.map((social) => (
                <SocialTabItem social={social} key={social?.id} />
              ))}
            </TableBody>
          </Table>
          <NoData show={socials.length == 0} />
        </div>
      </Container>
    </>
  );
};

export default Social;
