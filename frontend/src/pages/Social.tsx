import React from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Container from "../components/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useModal } from "../hooks/useModal";
import ModalComponent from "../components/ModalComponent";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import IconButton from "@mui/material/IconButton";

const socialTypes = [
  { id: 1, name: "Facebook", logo: "facebook" },
  { id: 2, name: "X.com", logo: "x" },
  { id: 3, name: "Linkedin", logo: "linkedin" },
  { id: 4, name: "Instagram", logo: "instagram" },
];

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

const Social: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {};
  const [selectdPlatform, setSelectedPlatform] = React.useState<{
    id: number;
    name?: string;
    logo?: string;
  } | null>({ id: 1 });

  const { isOpen, openModal, closeModal } = useModal();
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
                key={`${platform.name}-${index}`}
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
                  src="/images/product/product-01.jpg"
                  alt=""
                  className="w-16 h-16 object-cover rounded-md mb-2"
                />
                <div className="text-sm font-medium text-gray-700">
                  {platform.name}
                </div>
              </a>
            ))}
          </div>

          <TextField
            id="outlined-basic"
            label="Lien du réseau social"
            size="small"
            variant="outlined"
            fullWidth
            required
          />
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
              {tableData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={order.user.image}
                          alt={order.user.name}
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.projectName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex space-x-2">
                      <IconButton color="info" aria-label="delete" size="large">
                        <DriveFileRenameOutlineIcon />
                      </IconButton>

                      <IconButton color="error" aria-label="delete" size="large">
                        <DeleteOutlineIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default Social;
