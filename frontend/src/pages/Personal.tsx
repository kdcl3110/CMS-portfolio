import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import UploadCard from "../components/UploadCard";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { updateProfil } from "../slices/auth";
import { showError, showSucces } from "../components/Toasts";

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

interface UserForm {
  // Informations personnelles
  email: string;
  username: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;

  // Biographie
  biography: string;

  // Adresse
  country: string;
  city: string;
  postalCode: string;
  street: string;
  houseNumber: string;

  // Fichiers
  profilImage: File | null;
  banner: File | null;

  // Optionnel: autres champs que vous pourriez avoir
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Personal: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [userData, setUserData] = useState<UserForm>({
    email: "",
    username: "",
    lastName: "",
    firstName: "",
    phoneNumber: "",
    biography: "",
    country: "",
    city: "",
    postalCode: "",
    street: "",
    houseNumber: "",
    profilImage: null,
    banner: null,
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setUserData({
      email: currentUser?.email,
      username: currentUser?.username,
      lastName: currentUser?.last_name || "",
      firstName: currentUser?.first_name || "",
      phoneNumber: currentUser?.phone_number || "",
      biography: currentUser?.bio || "",
      country: currentUser?.country || "",
      city: currentUser?.city || "",
      postalCode: currentUser?.postal_code || "",
      street: currentUser?.street || "",
      houseNumber: currentUser?.house_number || "",
      profilImage: null,
      banner: null,
    });
  }, [currentUser?.id]);

  const [loading, setLoading] = useState(false);

  const handleInputChange =
    (field: keyof UserForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUserData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return `Format de fichier non supporté. Utilisez: ${validTypes.join(
        ", "
      )}`;
    }

    if (file.size > maxSize) {
      return "Le fichier est trop volumineux. Taille maximale: 5MB";
    }

    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validation basique
      if (!userData.email || !userData.username) {
        alert("Email et nom d'utilisateur sont requis");
        return;
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        alert("Format d'email invalide");
        return;
      }

      // Validation du téléphone si fourni
      if (userData.phoneNumber) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(userData.phoneNumber)) {
          alert(
            "Format de téléphone invalide. Utilisez le format 123-456-7890"
          );
          return;
        }
      }

      if (userData.profilImage) {
        const profileError = validateFile(userData.profilImage);
        if (profileError) {
          showError(`Image de profil: ${profileError}`);
          return;
        }
      }

      if (userData.banner) {
        const bannerError = validateFile(userData.banner);
        if (bannerError) {
          showError(`Bannière: ${bannerError}`);
          return;
        }
      }

      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);

      if (userData.firstName) formData.append("first_name", userData.firstName);
      if (userData.lastName) formData.append("last_name", userData.lastName);
      if (userData.country) formData.append("country", userData.country);
      if (userData.city) formData.append("city", userData.city);
      if (userData.biography) formData.append("bio", userData.biography);
      if (userData.postalCode)
        formData.append("postal_code", userData.postalCode);
      if (userData.street) formData.append("street", userData.street);
      if (userData.houseNumber)
        formData.append("house_number", userData.houseNumber);
      if (userData.phoneNumber)
        formData.append("phone_number", userData.phoneNumber);

      if (userData.profilImage) {
        formData.append("profile_image_file", userData.profilImage);
        console.log("Image de profil ajoutée:", {
          name: userData.profilImage.name,
          type: userData.profilImage.type,
          size: userData.profilImage.size,
        });
      }

      if (userData.banner) {
        formData.append("banner_file", userData.banner);
        console.log("Bannière ajoutée:", {
          name: userData.banner.name,
          type: userData.banner.type,
          size: userData.banner.size,
        });
      }

      // Debug: Afficher le contenu du FormData
      console.log("=== Contenu du FormData ===");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], ":", {
            name: pair[1].name,
            type: pair[1].type,
            size: pair[1].size,
          });
        } else {
          console.log(pair[0], ":", pair[1]);
        }
      }

      // Dispatch de l'action
      await dispatch(updateProfil(formData))
        .unwrap()
        .then((res) => {
          console.log("Réponse du serveur:", res);
          showSucces("Mise à jour réussie");

          // Réinitialiser les fichiers après succès
          setUserData((prev) => ({
            ...prev,
            profilImage: null,
            banner: null,
          }));
        })
        .catch((err) => {
          console.error("Erreur de mise à jour:", err);
          showError(err?.message || err || "Erreur lors de la mise à jour");
        });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde du profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Infos personnelles" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <GridItem title="Infos personnelles">
          <TextField
            label="Email"
            value={userData.email}
            size="small"
            onChange={handleInputChange("email")}
            variant="outlined"
            fullWidth
            type="email"
            required
            error={
              userData.email !== "" &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)
            }
            helperText={
              userData.email !== "" &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)
                ? "Format d'email invalide"
                : ""
            }
          />
          <TextField
            label="Nom d'utilisateur"
            value={userData.username}
            size="small"
            onChange={handleInputChange("username")}
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            label="Nom de famille"
            value={userData.lastName}
            size="small"
            onChange={handleInputChange("lastName")}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Prénom"
            value={userData.firstName}
            size="small"
            onChange={handleInputChange("firstName")}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Numéro de téléphone"
            value={userData.phoneNumber}
            type="text"
            onChange={handleInputChange("phoneNumber")}
            helperText="Format: 123-456-7890"
            size="small"
            variant="outlined"
            fullWidth
            error={
              userData.phoneNumber !== "" &&
              !/^\d{3}-\d{3}-\d{4}$/.test(userData.phoneNumber)
            }
          />
        </GridItem>

        <GridItem title="Biographie">
          <Box component="div" sx={{ "& .MuiTextField-root": { m: 0 } }}>
            <FormControl fullWidth>
              <TextField
                label="Biographie"
                value={userData.biography}
                onChange={handleInputChange("biography")}
                multiline
                rows={10}
                variant="outlined"
                placeholder="Parlez-nous de vous..."
              />
            </FormControl>
          </Box>
        </GridItem>

        <GridItem title="Adresse">
          <TextField
            label="Pays"
            value={userData.country}
            size="small"
            onChange={handleInputChange("country")}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Ville"
            value={userData.city}
            size="small"
            onChange={handleInputChange("city")}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Code postal"
            value={userData.postalCode}
            type="number"
            size="small"
            onChange={handleInputChange("postalCode")}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Rue"
            value={userData.street}
            size="small"
            onChange={handleInputChange("street")}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Numéro de maison"
            value={userData.houseNumber}
            type="number"
            size="small"
            onChange={handleInputChange("houseNumber")}
            variant="outlined"
            fullWidth
          />
        </GridItem>

        <GridItem title="Photo de profil">
          <UploadCard
            width="w-full"
            height="h-48"
            url={currentUser.profile_image_url}
            onFileSelect={(file) => {
              setUserData((prev) => ({
                ...prev,
                profilImage: file,
              }));
            }}
          />
          {/* {userData.profilImage && (
            <div className="text-sm text-gray-600">
              Fichier sélectionné: {userData.profilImage.name}
            </div>
          )} */}
        </GridItem>

        <GridItem title="Bannière">
          <UploadCard
            width="w-full"
            height="h-48"
            url={currentUser.banner_url}
            onFileSelect={(file) => {
              setUserData((prev) => ({
                ...prev,
                banner: file,
              }));
            }}
          />
          {/* {userData.banner && (
            <div className="text-sm text-gray-600">
              Fichier sélectionné: {userData.banner.name}
            </div>
          )} */}
        </GridItem>

        <GridItem title="Terminer">
          <div className="text-gray-600">
            Si les modifications sont terminées, vous pouvez les enregistrer en
            cliquant sur le bouton suivant.
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !userData.email || !userData.username}
            fullWidth
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </GridItem>
      </div>
    </>
  );
};

export default Personal;
