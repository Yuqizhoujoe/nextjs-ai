import React from "react";

const ButtonStyleEnum = {
  PurpleToBlue: "purple_to_blue",
  CyanToBlue: "cyan_to_blue",
  RedToYellow: "red_to_yellow",
};

// export type ButtonStyle =
//   | "purple_to_blue"
//   | "cyan_to_blue"
//   // | "green_to_blue"
//   // | "purple_to_pink"
//   // | "pink_to_orange"
//   | "red_to_yellow";

export type ButtonStyle =
  (typeof ButtonStyleEnum)[keyof typeof ButtonStyleEnum];

export interface ButtonInterface {
  name?: string;
  children?: React.ReactNode | React.ReactNode[];
  id: string;
  style: ButtonStyle;
  type: "button" | "submit" | "reset";
  clickFn?: (e: any) => {};
}

const commonStyle: string =
  "relative inline-flex items-center justify-center p-0.5 mb-2 mt-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br";

const buttonStyles: {
  [key in ButtonStyle]: string;
} = {
  purple_to_blue:
    "from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300",
  cyan_to_blue:
    "from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200",
  red_to_yellow:
    "from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 focus:ring-4 focus:outline-none focus:ring-red-100",
};

export default function Button(props: ButtonInterface) {
  const { name, children, id, style, type, clickFn } = props;
  const renderButton = () => {
    return (
      <button
        key={id}
        type={type}
        data-testid={`${id}-button`}
        className={`${commonStyle} ${buttonStyles[style]}`}
        onClick={clickFn}
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
          {name || children}
        </span>
      </button>
    );
  };

  return renderButton();
}
