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
import { Skill, SkillPayload } from "../../interfaces/skill";
import { deleteSkill, getMySkills, updateSkill } from "../../slices/skill";

interface CompetenceTabItemProps {
  skill: Skill;
}

const CompetenceTabItem: React.FC<CompetenceTabItemProps> = ({ skill }) => {
  const validationSchema = Yup.object().shape({
    label: Yup.string().required("Entrer l'intitulé de la compétence").trim(),
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

  const [error, setError] = useState<string>("");
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    setValue("label", skill.label);
  }, [skill.id, isOpen]);

  const updateData = (data: any) => {
    if (data.label) {
      const params: SkillPayload = {
        label: data.label,
      };

      dispatch(updateSkill({ id: skill.id, data: params }))
        .unwrap()
        .then((res) => {
          console.log(res);

          closeModal();
          setError("");
          showSucces("Opération réussie");
          dispatch(getMySkills(""));
        })
        .catch((err) => {
          closeModal();
          showError(err);
          setError(err);
        });
    }
  };

  const deleteData = () => {
    dispatch(deleteSkill({ id: skill.id }))
      .unwrap()
      .then((res) => {
        console.log(res);
        closeModal();
        showSucces("Opération réussie");
        dispatch(getMySkills(""));
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
        description="Veuillez modifier les informations de la compétence."
      >
        <div className="space-y-4">
          <TextField
            id="outlined-basic"
            label="Compétence"
            size="small"
            variant="outlined"
            value={watchAllFields.label}
            onChange={(event) => setValue("label", event.target.value)}
            error={errors?.label != null}
            fullWidth
            required
          />
          <span className="text-red-500">{error.trim() != "" && error}</span>
        </div>
      </ModalComponent>

      <TableRow key={skill.id}>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {skill.label}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <IconButton
              color="info"
              aria-label="delete"
              onClick={(e) => {
                e.preventDefault();
                openModal();
              }}
              size="large"
            >
              <DriveFileRenameOutlineIcon />
            </IconButton>

            <Popconfirm
              title="Supprimer la compétence"
              description="Êtes-vous sûr de vouloir supprimer la compétence ?"
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

export default CompetenceTabItem;
