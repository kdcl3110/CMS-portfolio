import React from "react";

interface ContainerProps {
  children?: React.ReactNode;
  title?: string;
  leftCompponent?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  children,
  title,
  leftCompponent,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <div>{leftCompponent}</div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default Container;
