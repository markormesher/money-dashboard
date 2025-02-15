import React, { ReactElement } from "react";
import "./tile-set.css";
import { concatClasses } from "../../../utils/style";

type TileSetProps = unknown;
type TileProps = {
  className?: string;
};

function TileSet(props: React.PropsWithChildren<TileSetProps>): ReactElement {
  return <div className={"tile-set"}>{props.children}</div>;
}

function Tile(props: React.PropsWithChildren<TileProps>): ReactElement {
  return <article className={concatClasses("tile", props.className)}>{props.children}</article>;
}

export { TileSet, Tile };
