import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Container from "../../components/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ModalComponent from "../../components/ModalComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useModal } from "../../hooks/useModal";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../../components/NoData";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SkillPayload } from "../../interfaces/skill";
import { createSkill, getMySkills } from "../../slices/skill";
import { showError, showSucces } from "../../components/Toasts";
import CompetenceTabItem from "./CompetenceTabItem";

const Competence: React.FC = () => {
  const validationSchema = Yup.object().shape({
    label: Yup.string().required("Entrer l'intitulé de la compétence").trim(),
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
  const { skills } = useSelector((state: RootState) => state.skill);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const newSkill = (data: any) => {
    const params: SkillPayload = {
      label: data.label,
      user: currentUser.id,
    };

    dispatch(createSkill(params))
      .unwrap()
      .then((res) => {
        console.log(res);
        closeModal();
        showSucces("Opération réussie");
        dispatch(getMySkills(""));
      })
      .catch((err) => showError(err));
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Compétences" />
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        action={handleSubmit(newSkill)}
        title="Ajouter une compétence"
        description="Veuillez remplir les informations suivantes pour ajouter une nouvelle compétence."
      >
        <div className="space-y-4">
          <TextField
            id="outlined-basic"
            label="Compétence"
            size="small"
            variant="outlined"
            onChange={(e) => setValue("label", e.target.value)}
            error={errors.label != null}
            fullWidth
            required
          />
        </div>
      </ModalComponent>

      <Container
        title="Compétences"
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
                  Label
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
              {skills.map((skill) => (
                <CompetenceTabItem key={skill.id} skill={skill} />
              ))}
            </TableBody>
          </Table>

          <NoData show={skills.length == 0} />
        </div>
      </Container>
    </>
  );
};

export default Competence;
