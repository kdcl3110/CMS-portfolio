import React from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Container from "../components/Container";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

const GridItem = ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title?: string;
}) => {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-md shadow-sm p-3 space-y-3">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
};

const Education: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {};
  return (
    <>
      <PageBreadcrumb pageTitle="Education" />
      
    </>
  );
};

export default Education;
