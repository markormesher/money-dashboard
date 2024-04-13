import * as React from "react";
import { levenshteinDistance } from "../../../helpers/levenshtein-distance";
import { combine } from "../../../helpers/style-helpers";
import { UIConstants } from "../../_commons/ui-constants";
import { ControlledTextInput, ControlledTextInputProps } from "../ControlledInputs/ControlledTextInput";
import * as styles from "./SuggestionTextInput.scss";

type SuggestionTextInputProps = ControlledTextInputProps & {
  readonly suggestionOptions?: string[];
};

function removeRegexChars(str: string): string {
  return str.replace(/[\^$\\+*?.(){}[\]]/g, "");
}

function SuggestionTextInput(props: SuggestionTextInputProps): React.ReactElement {
  const MAX_SUGGESTIONS_SHOWN = 10;

  const { suggestionOptions, ...inputProps } = props;
  const innerInputProps = inputProps?.inputProps || {};

  const [userInput, setUserInput] = React.useState<string>();
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<string>();
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = React.useState(-1);

  // suggestion logic

  function populateSuggestions(value: string): void {
    if (!value || value === "") {
      clearSuggestions();
      return;
    }

    const regex = new RegExp(".*" + removeRegexChars(value).split("").join(".*") + ".*", "i");
    const scores: Record<string, number> = {};
    const newSuggestions = (suggestionOptions ?? [])
      .filter((s) => regex.test(s))
      .sort((a, b) => {
        scores[a] = scores[a] || levenshteinDistance(value, a);
        scores[b] = scores[b] || levenshteinDistance(value, b);
        return scores[a] - scores[b];
      });

    // if the previously-selected suggestion is still in the list, keep it selected
    const newSelectedSuggestionIndex = selectedSuggestion ? newSuggestions.indexOf(selectedSuggestion) : -1;
    const newSelectedSuggestion =
      newSelectedSuggestionIndex >= 0 ? newSuggestions[newSelectedSuggestionIndex] : undefined;

    setUserInput(value);
    setSuggestions(newSuggestions);
    setSelectedSuggestion(newSelectedSuggestion);
    setSelectedSuggestionIndex(newSelectedSuggestionIndex);
  }

  function clearSuggestions(): void {
    setSuggestions([]);
    setSelectedSuggestion(undefined);
    setSelectedSuggestionIndex(-1);
  }

  // interaction

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void {
    let newIndex: number;
    switch (evt.keyCode) {
      case UIConstants.keys.UP:
        newIndex = Math.max(0, selectedSuggestionIndex - 1);
        setSelectedSuggestionIndex(newIndex);
        setSelectedSuggestion(suggestions[newIndex]);
        evt.preventDefault();
        break;

      case UIConstants.keys.DOWN:
        newIndex = Math.min(MAX_SUGGESTIONS_SHOWN - 1, Math.min(suggestions.length - 1, selectedSuggestionIndex + 1));
        setSelectedSuggestionIndex(newIndex);
        setSelectedSuggestion(suggestions[newIndex]);
        evt.preventDefault();
        break;

      case UIConstants.keys.ENTER:
        if (suggestions && suggestions.length && selectedSuggestion) {
          inputProps.onValueChange?.(selectedSuggestion, inputProps.id);
          clearSuggestions();
          evt.preventDefault();
        }
        break;

      case UIConstants.keys.ESC:
        if (suggestions && suggestions.length) {
          clearSuggestions();
          evt.preventDefault();
          evt.stopPropagation();
        }
        break;
    }
  }

  function handleSuggestionClick(evt: React.MouseEvent<HTMLLIElement>): void {
    const value = (evt.target as HTMLLIElement).title;
    inputProps.onValueChange?.(value, inputProps.id);
    clearSuggestions();
  }

  // ui

  function formatSuggestion(suggestion: string, input?: string): React.ReactElement {
    const output: React.ReactElement[] = [];
    const suggestionChars = suggestion.split("");
    let consumedInputIndex = 0;
    suggestionChars.forEach((c, i) => {
      if (c.length && c.toLowerCase() === input?.charAt(consumedInputIndex).toLowerCase()) {
        output.push(
          <span className={styles.highlight} key={`${i}-highlighted`}>
            {c}
          </span>,
        );
        ++consumedInputIndex;
      } else {
        output.push(<span key={`${i}-plain`}>{c}</span>);
      }
    });
    return <>{output}</>;
  }

  function renderSuggestions(): React.ReactElement {
    const hasOverflow = suggestions.length > MAX_SUGGESTIONS_SHOWN;
    return (
      <div className={styles.suggestionWrapper}>
        <ul>
          {suggestions.slice(0, MAX_SUGGESTIONS_SHOWN).map((s, i) => (
            <li
              key={s}
              title={s}
              className={combine(selectedSuggestionIndex === i && styles.active)}
              onMouseDown={handleSuggestionClick}
            >
              {formatSuggestion(s, userInput)}
            </li>
          ))}
          {hasOverflow && (
            <li key={"..."} className={styles.overflow}>
              ...
            </li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <>
      <ControlledTextInput
        {...inputProps}
        inputProps={{
          ...innerInputProps,
          onBlur: () => clearSuggestions(),
          onKeyDown: handleKeyDown,
        }}
        onValueChange={(value) => {
          populateSuggestions(value);
          inputProps.onValueChange?.(value, inputProps.id);
        }}
      />
      {suggestions && suggestions.length > 0 && renderSuggestions()}
    </>
  );
}

export { SuggestionTextInput };
