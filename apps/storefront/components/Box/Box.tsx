import clsx from "clsx";
import { HTMLAttributes } from "react";

import styles from "./Box.module.css";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  shadowless?: boolean;
}

export const Box = ({ className, ...rest }: BoxProps) => (
  <div className={clsx(styles.box, className)} {...rest} />
);

export default Box;
