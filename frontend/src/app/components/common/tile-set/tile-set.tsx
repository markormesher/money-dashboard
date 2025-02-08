import React, { ReactElement } from "react";
import "./tile-set.css";

type TileSetProps = unknown;
type TileProps = unknown;

function TileSet(props: React.PropsWithChildren<TileSetProps>): ReactElement {
  return <div className={"tile-set"}>{props.children}</div>;
}

function Tile(props: React.PropsWithChildren<TileProps>): ReactElement {
  return <article className={"tile"}>{props.children}</article>;
}

export { TileSet, Tile };
