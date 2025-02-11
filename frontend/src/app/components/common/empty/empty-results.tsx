import React, { ReactElement } from "react";
import "./empty-results.css";

type EmptyResultsPanelProps = {
  pluralNoun: string;
};

function EmptyResultsPanel(props: EmptyResultsPanelProps): ReactElement {
  return (
    <div className={"empty-results"}>
      <p>No {props.pluralNoun} found. Try adjusting your filters or creating a new entry.</p>
    </div>
  );
}

export { EmptyResultsPanel };
